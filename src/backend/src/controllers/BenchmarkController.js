const dao = require('../dao/BenchmarkDAO')
const apis = require('../utils/apis');
const summary = require('../utils/summary');

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
        for (let i in result.data){
          if (parseInt(result.data[i].execution_running,10) === 1){
            const benchmark = result.data[i]
            const executions = await app.controllers.BenchmarkExecutionController.list({query:{id_benchmark:benchmark.id, finished:"0"}})
            let countConcurrences = 0
            for (const idx in executions.data){
              const execution = executions.data[idx]
              if (execution.results && execution.results.raw){
                for (let x in execution.results.raw){
                  countConcurrences = countConcurrences + Object.values(execution.results.raw[x]).length
                }
              }
            }
            const expectedConcurrences = benchmark.repetitions * benchmark.concurrences.list.length
            result.data[i].execution_percent = expectedConcurrences ? countConcurrences/expectedConcurrences : 0
          }
        }
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

  const play = async (req, res) => {
    try {
      const { id } = req.params
        const benchmark = await app.controllers.BenchmarkController.get({params:{id:id}})
        const usecase = await app.controllers.UseCaseController.get({params:{id:benchmark.id_usecase}})
        const usecase_status = await apis.get(`status/${usecase.id}/${usecase.acronym}`,"orchestrator")
        if ((usecase && parseInt(usecase.provisionable,10) === 0) || (usecase_status && usecase_status.data.status==2)){
          new Promise(async(resolve, reject) => {
            const create_execution = await app.controllers.BenchmarkExecutionController.create({body:{id_benchmark:id,results:{},started_at:new Date().toISOString()}})
            const id_benchmarkExecution = create_execution[0]
            const usecase_provider = Object.keys(usecase.urls)
            const provider = usecase_provider[0]
            const full_url = usecase.urls[provider][benchmark.activation_url]
            const parameters = benchmark.parameters || {}
            parameters.activation_url = benchmark.activation_url
            let results = {
              raw:{},
              summary:{}
            }
            if (full_url){
              const url = full_url.split("//")[1].split("/")[0]
              const protocol = full_url.split("://")[0]
              let url_path = full_url.replace(protocol,'').replace("://",'').replace(url,'')
              url_path = url_path ? url_path : 'default'
              parameters.url_path = url_path
              // If warm up is configured
              if (parseInt(benchmark.warm_up,10) === 1){
                let hrTime = process.hrtime()
                hrTime = Math.floor(hrTime[0] * 1000000 + hrTime[1] / 1000)
                await apis.post(`run/warmup${hrTime}/${provider}/${protocol}/${url}/1/1/1`, parameters ,"benchmarker")
                const warmUprs = await apis.get(`results/warmup${hrTime}/${provider}/1/1`,"benchmarker")
                results["warm_up"] = 1
                if (warmUprs && warmUprs.data){
                  results["warm_up_raw"] = warmUprs.data
                }  
              }
              for (let repetition = 1; repetition <= benchmark.repetitions ; repetition++) {
                results["raw"][repetition] = {}
                for (let idx in benchmark.concurrences.list){
                  let concurrence = benchmark.concurrences.list[idx]
                  results["raw"][repetition][concurrence] = {}
                  const be = await app.controllers.BenchmarkExecutionController.get({params:{id:id_benchmarkExecution}})
                  if (parseInt(be.finished,10)===0){
                    parameters.repetition = repetition
                    parameters.concurrence = concurrence
                    parameters.timeout = benchmark.timeout*1000
                    // Running the test
                    await apis.post(`run/${id_benchmarkExecution}/${provider}/${protocol}/${url}/${concurrence}/${repetition}/1`, parameters ,"benchmarker")
                    
                    // Wait time between seconds_between_concurrences
                    if (benchmark.seconds_between_concurrences){
                      let waitTime = benchmark.seconds_between_concurrences
                      if (parseInt(benchmark.seconds_between_concurrences_majored_by_concurrence,10) === 1){
                        waitTime *= concurrence
                      }
                      console.log(`Waiting ${waitTime} seconds between concurrence`)
                      await new Promise(resolve => setTimeout(resolve, waitTime * 1000))
                    }

                    // Getting the results
                    const rs = await apis.get(`results/${id_benchmarkExecution}/${provider}/${concurrence}/${repetition}`,"benchmarker")
                    
                    // If results are ok them generates reports and aggregate to global results
                    if (rs && rs.data){
                        await apis.get(`generateReport/${id_benchmarkExecution}/${provider}/${concurrence}/${repetition}`,"benchmarker")
                        results["raw"][repetition][concurrence] = {...results["raw"][repetition][concurrence],...rs.data}
                    }
                  
                    // Flush partial results on database
                    await app.controllers.BenchmarkExecutionController.update({params:{id:id_benchmarkExecution},body:{id_benchmark:benchmark.id,results:results}})
                  }
                }
                // Wait time between repetitions
                if (benchmark.seconds_between_repetitions){
                  await new Promise(resolve => setTimeout(resolve, benchmark.seconds_between_repetitions * 1000))
                }
              }
            }
            results.summary = summary.generate(results)
            await app.controllers.BenchmarkExecutionController.update({params:{id:id_benchmarkExecution},body:{id_benchmark:benchmark.id,results:results,finished_at:new Date().toISOString(),finished:1}})
            resolve();
          })
        res.status(200).json({"ok":"Started"})
      } else {
        return res.status(204).json({"error":"not ready"})
      }
    } catch (error) {
        return res.status(500).json(`Error: ${error}`)
    }
  };

const stop = async (req, res) => {
    try {
        const { id } = req.params
        const benchmark = await app.controllers.BenchmarkController.get({params:{id:id}})
        await apis.get(`cancel/${id}`,"benchmarker")
        const executions = await app.controllers.BenchmarkExecutionController.list({query:{id_benchmark:id, finished:"0"}})
        for (const idx in executions.data){
            const execution = executions.data[idx]
            const update_execution = await app.controllers.BenchmarkExecutionController.update({params:{id:execution.id},body:{finished_at:new Date().toISOString(), finished:1}})
        }
        res.status(200).json({"ok":"Started"})
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
    play,
    stop,
  };
};
