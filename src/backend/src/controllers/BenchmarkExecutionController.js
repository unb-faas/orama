const dao = require('../dao/BenchmarkExecutionDAO')
const apis = require('../utils/apis');
const fs = require('fs')
const uuid = require('uuid');
const jsonexport = require('jsonexport');

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
        return  (res) ? res.status(500).json(`Error: ${error}`) : result
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

  const series = async (req, res) => {
    try {
        const result = await dao.getPage(req.query);
        const series = {}
        for (let i in result.data){
          const execution = result.data[i]
          const repetitions = (execution.results) ? Object.keys(execution.results.raw).length : 0
          let requests = 0
          if (execution.results){
            for (let repetition in execution.results.raw){
              for (let concurrence in execution.results.raw[repetition]){
                requests += Object.keys(execution.results.raw[repetition][concurrence]).length
              }
            }
            if (execution.results.warm_up===1){
              requests += 1
            }
          }
          const serie = {
            date:execution.date,
            repetitions:repetitions,
            requests:requests
          }
          series[execution.id] = serie
        }

        return (res) ? res.json(series) : series;
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
        return (res) ? res.status(500).json(`Error: ${error}`) : `Error: ${error}`
    }  
  };

  const create = async (req, res) => {
    try {
        const result = await dao.create(req.body)
        return (res) ? res.json(result) : result
    } catch (error) {
        return (res) ? res.status(500).json(`Error: ${error}`) : `Error: ${error}`
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
        return (res) ? res.status(500).json(`Error: ${error}`) : `Error: ${error}`
    }  
  };

  const requestCounter = async (req, res) => {
    try {
        const benchmarkExecutions = await dao.getPage(req.query)
        const useCaseBuffer = {}
        const benchmarkBuffer = {}
        const providerCounter = {}
        const useCaseCounter = {}
        if (benchmarkExecutions.data){
          for (let i in benchmarkExecutions.data){
            const benchmarkExecution = benchmarkExecutions.data[i]
            let benchmark = null
            if (benchmarkBuffer[benchmarkExecution.id_benchmark]){
              benchmark = benchmarkBuffer[benchmarkExecution.id_benchmark]
            } else {
              benchmark = await app.controllers.BenchmarkController.get({params:{id:benchmarkExecution.id_benchmark}})
              benchmarkBuffer[benchmarkExecution.id_benchmark] = benchmark
            }
            let usecase = null
            if (useCaseBuffer[benchmark.id_usecase]){
              usecase = useCaseBuffer[benchmark.id_usecase]
            } else {
              usecase = await app.controllers.UseCaseController.get({params:{id:benchmark.id_usecase}})
              useCaseBuffer[benchmark.id_usecase] = usecase
            }
            if (benchmarkExecution.results && benchmarkExecution.results && benchmarkExecution.results.raw){
              for (let repetition in benchmarkExecution.results.raw){
                for (let concurrence in benchmarkExecution.results.raw[repetition]){
                  let requestsCount = Object.keys(benchmarkExecution.results.raw[repetition][concurrence]).length
                  useCaseCounter[benchmark.id_usecase] = (useCaseCounter[benchmark.id_usecase]) ? useCaseCounter[benchmark.id_usecase] + requestsCount : requestsCount
                  providerCounter[usecase.id_provider] = (providerCounter[usecase.id_provider]) ? providerCounter[usecase.id_provider] + requestsCount : requestsCount
                }
              }
              if (benchmarkExecution.results.warm_up === 1){
                useCaseCounter[benchmark.id_usecase] += 1
                providerCounter[usecase.id_provider] += 1
              }
            }
          }
        }

        const providerBuffer = {}
        for (let id_usecase in useCaseCounter){
          usecase = useCaseBuffer[id_usecase]
          provider = await app.controllers.ProviderController.get({params:{id:usecase.id_provider}})
          providerBuffer[provider.id] = provider
          useCaseCounter[id_usecase] = {
            usecase:usecase,
            requestCounter:useCaseCounter[id_usecase]
          }
        }

        for (let id_provider in providerCounter){
          provider = providerBuffer[id_provider]
          providerCounter[id_provider] = {
            provider:provider,
            requestCounter:providerCounter[id_provider]
          }
        }

        const result = {usecaseCounter:useCaseCounter, providerCounter:providerCounter}
        let status_code = 200
        if (!result){
          status_code = 404
        }
        return (res) ? res.status(status_code).json(result) : result;   
    } catch (error) {
        return res.status(500).json(`Error: ${error}`)
    }  
  };

  const downloadFile = async (req, res) => {
    try {
      const { id, type } = req.params
      const execution = await dao.getById(id)
      let consolidated = []
      for (let repetition in execution.results.raw){
        for (let concurrence in execution.results.raw[repetition]){
          consolidated = consolidated.concat(Object.values(execution.results.raw[repetition][concurrence]))
        }  
      }
      const fileUuid = uuid.v1() 
      let url = null
      let filepath = null
      switch (type) {
        case "json":
          filepath = `/jsons/${fileUuid}.json` 
          fs.writeFileSync(filepath, JSON.stringify(consolidated))
          url = `${apis.urls('backend')}/../../..${filepath}` 
        break;

        case "csv":
          filepath = `/csvs/${fileUuid}.csv`
          const csv = await jsonexport(consolidated)
          fs.writeFileSync(filepath, csv)
          url = `${apis.urls('backend')}/../../..${filepath}` 
        break;
      
        default:
          break;
      }

      let status_code = 200      
      return (res) ? res.status(status_code).json(url) : url;        
    } catch (error) {
        return  (res) ? res.status(500).json(`Error: ${error}`) : result
    }
  };

  
  return {
    get,
    list,
    remove,
    update,
    create,
    series,
    requestCounter,
    downloadFile
  };
};
