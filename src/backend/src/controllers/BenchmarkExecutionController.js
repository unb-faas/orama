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
       
        if (typeof req.query.compare != 'undefined'){
          let concurrences = []
          for (let i in result.data){
            for (let x in result.data[i].results.raw[1]){
              const concurrence = parseInt(x)
              concurrences.push(concurrence)
            }
          }
          setConcurrences = [... new Set(concurrences.sort((a, b) => a - b))]
          concurrences = {}
          let warmUpTimes = {}
          for (let y in setConcurrences){
            let concurrence = setConcurrences[y]
            for (let i in result.data){
              const id_benchmark = result.data[i].id_benchmark
              if (!concurrences[id_benchmark]){
                concurrences[id_benchmark] = {}
              }

              if (result.data[i].results.warm_up_raw && result.data[i].results.warm_up_raw[0]){
                warmUpTimes[id_benchmark] = parseFloat(result.data[i].results.warm_up_raw[0].Latency)
              }

              for (let x in result.data[i].results.raw){
                const requests = result.data[i].results.raw[x][concurrence]
                if (!concurrences[id_benchmark]["consolidated"]) {
                  concurrences[id_benchmark]["consolidated"] = {}
                }
                if (!concurrences[id_benchmark]["success"]) {
                  concurrences[id_benchmark]["success"] = {}
                }
                if (!concurrences[id_benchmark]["failed"]) {
                  concurrences[id_benchmark]["failed"] = {}
                }
                if (!concurrences[id_benchmark]["success"][concurrence]) {
                  concurrences[id_benchmark]["success"][concurrence] = 0
                }
                if (!concurrences[id_benchmark]["failed"][concurrence]) {
                  concurrences[id_benchmark]["failed"][concurrence] = 0 
                }
                if (!concurrences[id_benchmark]["consolidated"][concurrence]){
                  concurrences[id_benchmark]["consolidated"][concurrence] = {}
                  concurrences[id_benchmark]["consolidated"][concurrence]["sum"] = 0.0
                  concurrences[id_benchmark]["consolidated"][concurrence]["count"] = 0
                }
                for (let r in requests){
                  if (typeof req.query.despise_errors === 'undefined' || req.query.despise_errors === 'false'  || (req.query.despise_errors === 'true' && typeof req.query.despise_errors != 'undefined' && requests[r].success && requests[r].success.toLowerCase() === 'true')){
                    if (requests[r].Latency){
                      concurrences[id_benchmark]["consolidated"][concurrence]["sum"] += parseFloat(requests[r].Latency)
                      concurrences[id_benchmark]["consolidated"][concurrence]["count"]++
                    }
                  }
                  if (requests[r].success && requests[r].success.toLowerCase() === 'true'){
                    concurrences[id_benchmark]["success"][concurrence] ++
                  } else {
                    concurrences[id_benchmark]["failed"][concurrence] ++
                  }
                }                    
              }
            }
          }
          
          let failedSum = []
          for (let i in concurrences){
            const id_benchmark = i
            const benchmark = await app.controllers.BenchmarkController.get({params:{id:id_benchmark}})
            concurrences[id_benchmark]["benchmark"] = benchmark  
            concurrences[id_benchmark]["avg"] = []
            concurrences[id_benchmark]["failureRate"] = []
            concurrences[id_benchmark]["failedSum"] = []
            let failedSumPartial = 0
            for (let concurrence in concurrences[id_benchmark]["consolidated"]){
              failedSumPartial += concurrences[id_benchmark]["failed"][concurrence]
              const subtotalRequests = concurrences[id_benchmark]["success"][concurrence] + concurrences[id_benchmark]["failed"][concurrence]
              const failureRate = subtotalRequests && concurrences[id_benchmark]["failed"][concurrence] ? concurrences[id_benchmark]["failed"][concurrence] / subtotalRequests * 100 : 0
              concurrences[id_benchmark]["avg"].push((concurrences[id_benchmark]["consolidated"][concurrence].count) ? concurrences[id_benchmark]["consolidated"][concurrence].sum / concurrences[id_benchmark]["consolidated"][concurrence].count : null)
              concurrences[id_benchmark]["failureRate"].push(Math.ceil(failureRate))
              delete concurrences[id_benchmark]["consolidated"][concurrence].count
              delete concurrences[id_benchmark]["consolidated"][concurrence].sum
              delete concurrences[id_benchmark]["consolidated"][concurrence] 
            }
            delete concurrences[id_benchmark]["consolidated"]
            failedSum.push(failedSumPartial)
          }
          
          result.compare = concurrences
          result.labels = setConcurrences
          result.failedSum = failedSum
          result.warmUpTimes = warmUpTimes
          delete result.data
       
        }
        result.data = result.data.splice(10,10)
        return (res) ? res.json(result) : result;
    } catch (error) {
      console.log("wp5")
       
        return (res) ? res.status(500).json(`Error: ${error}`) : `Error: ${error}`
    }
  };

  const series = async (req, res) => {
    try {
        const result = await dao.getPage(req.query);
        const series = {}
        for (let i in result.data){
          const execution = result.data[i]
          if (execution.finished === 1){
            const repetitions = (execution.results && execution.results.raw) ? Object.keys(execution.results.raw).length : 0
            let requests = 0
            if (execution.results && execution.results.raw){
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

        const partialResults = await app.controllers.BenchmarkExecutionPartialResultController.list({query:{size:9999999,id_benchmark_execution:id}})
                
        for (let i in partialResults.data){
            const partialResult = partialResults.data[i]
            const re = await app.controllers.BenchmarkExecutionPartialResultController.remove({params:{id:partialResult.id}})
            console.log(partialResult.id)
            console.log(re)
        }



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
      const { subtype } = req.query
      const execution = await dao.getById(id)
      let consolidated = []
      for (let repetition in execution.results.raw){
        for (let concurrence in execution.results.raw[repetition]){
          const newValues = execution.results.raw[repetition][concurrence]
          if (subtype === "detailed"){
            for (const idx in newValues){
                newValues[idx].label = `Repetition ${repetition} under ${concurrence} of concurrency`
            }
          }
          if (subtype === "byrepetition"){
            for (const idx in newValues){
                newValues[idx].label = `Repetition ${repetition}`
            }
          }
          if (subtype === "byconcurrence"){
            for (const idx in newValues){
                newValues[idx].label = `Concurrence: ${concurrence}`
            }
          }
          consolidated = consolidated.concat(Object.values(newValues))
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

        case "dashboard":
          filepath = `/csvs/${fileUuid}.csv`
          const dashboard = await jsonexport(consolidated)
          fs.writeFileSync(filepath, dashboard)
          resul = await apis.get(`generateReportByCsv/${fileUuid}`,'benchmarker')
          url = `${apis.urls('benchmarker')}${resul.data.report_url}` 
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

  const partialResults = async (req, res) => {
    try {
        const { id } = req.params
        result = true
        let status_code = 200
        if (!result){
          status_code = 404
        }
        return (res) ? res.status(status_code).json(result) : result;   
    } catch (error) {
        return (res) ? res.status(500).json(`Error: ${error}`) : `Error: ${error}`
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
    downloadFile,
    partialResults
  };
};
