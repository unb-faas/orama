const dao = require('../dao/FactorialDesignDAO');
const { validate } = require('../utils/factorial');
const factorial = require('../utils/factorial')

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


  const analysis = async (req, res) => {
    try {
      const { id } = req.params
      const result = await dao.getById(id)
      const benchmarks = []
      for (let id_benchmark in result.benchmarks.list){
        if (result.benchmarks.list[id_benchmark]){
            const benchmark = await app.controllers.BenchmarkController.get({params:{id:id_benchmark}})
            let execution = null
            if (result.benchmarks.executions[id_benchmark]){
              execution = await app.controllers.BenchmarkExecutionController.get({params:{id:result.benchmarks.executions[id_benchmark]}})
            }
            benchmark.execution = execution
            benchmark.executionLower = result.benchmarks.executionsLower[id_benchmark]
            benchmark.executionUpper = result.benchmarks.executionsUpper[id_benchmark]
            benchmarks.push(benchmark)
        }
      }
      result.benchmarks = benchmarks
      result.validate = factorial.validate(benchmarks)
      if (result.validate.result){
        result.plan = factorial.plan(benchmarks)
      }
      let status_code = 200
      if (Object.keys(result).length === 0){
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
    analysis
  };
};
