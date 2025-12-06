const dao = require('../dao/UseCaseDAO')
const apis = require('../utils/apis');
const fs = require('fs')
const uuid = require('uuid');
const metrics = require('../utils/metrics');

module.exports = (app) => {

  const get = async (req, res) => {
    try {
      const { id } = req.params
      const result = await dao.getById(id)
      let status_code = 200
      if (Object.keys(result).length === 0){
        status_code = 404
      }
      return (res) ? res.status(status_code).json(result) : result;        
    } catch (error) {
        return res.status(500).json(`Error: ${error}`)
    }
  };

  const getMetrics = async (req, res) => {
    try {
      const { id } = req.params
      const result = await dao.getById(id)
      console.log(result)
      let status_code = 200
      if (Object.keys(result).length === 0){
        status_code = 404
        return (res) ? res.status(status_code) : result;        
      } else {
        const source_code_metrics = await metrics.getMetricsFromSourceCode(result.acronym).catch(err=>{
          return res.status(500).json(err)
        })
        if (Object.keys(source_code_metrics).length === 0){
          status_code = 500
          return (res) ? res.status(status_code).json(source_code_metrics) : source_code_metrics;        
        } else {
          const consolidated = source_code_metrics
          const fileUuid = uuid.v1() 
          const filepath = `/jsons/${fileUuid}.json` 
          fs.writeFileSync(filepath, JSON.stringify(consolidated))
          const url = `${apis.urls('backend')}/../../..${filepath}` 
          status_code = 200
          return (res) ? res.status(status_code).json(url) : url;     
        }   
      }
    } catch (error) {
        return res.status(500).json(`Error: ${error}`)
    }
  };

  const list = async (req, res) => {
    try {
        const result = await dao.getPage(req.query);
        return (res) ? res.json(result) : result;
    } catch (error) {
        return (res) ? res.status(500).json(`Error: ${error}`) : `Error: ${error}`
    }
  };

  const update = async (req, res) => {
    try {
        const { id } = req.params
        const result = await dao.update(id,req.body)
        let status_code = 200
        if (!result){
          status_code = 404
        }
        return (res) ? res.status(status_code).json(result) : result;        
      } catch (error) {
        return res.status(500).json(`Error: ${error}`)
    }  
  };

  const create = async (req, res) => {
    try {
        const result = await dao.create(req.body)
        return res.json(result);
    } catch (error) {
        return res.status(500).json(`Error: ${error}`)
    }  
  };

  const remove = async (req, res) => {
    try {
        const { id } = req.params
        const result = await dao.remove(id)
        let status_code = 200
        if (!result){
          status_code = 404
        }
        return (res) ? res.status(status_code).json(result) : result;   
    } catch (error) {
        return res.status(500).json(`Error: ${error}`)
    }  
  };
  
  return {
    get,
    list,
    remove,
    update,
    create,
    getMetrics
  };
};
