const dao = require('../dao/BenchmarkDAO')
const apis = require('../utils/apis')

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

  const play = async (req, res) => {
    try {
      const { id } = req.params
        const benchmark = await app.controllers.BenchmarkController.get({params:{id:id}})
        const usecase = await app.controllers.UseCaseController.get({params:{id:benchmark.id_usecase}})
        const usecase_status = await apis.get(`status/${usecase.id}/${usecase.acronym}`,"orchestrator")
        if (usecase_status && usecase_status.data.status==2){
          new Promise(async(resolve, reject) => {
            const create_execution = await app.controllers.BenchmarkExecutionController.create({body:{id_benchmark:id,results:{}}})
            const id_benchmarkExecution = create_execution[0]
            const urls_req = await apis.get(`urls/${usecase.id}/${usecase.acronym}`,"orchestrator")
            let results = {}
            for (const provider in urls_req.data){
                if (provider.toLowerCase() === benchmark.provider_acronym.toLowerCase()){
                  const urls = urls_req.data[provider]
                  const test_url = urls.get
                  const url = test_url.split("//")[1].split("/")[0]
                  const url_path = test_url.split("//")[1].split("/")[1]
                  
                  for (let repetition = 1; repetition <= benchmark.repetitions ; repetition++) {
                    results[repetition] = {}
                    for (let idx in benchmark.concurrences.list){
                      let concurrence = benchmark.concurrences.list[idx]
                      results[repetition][concurrence] = {}
                      const be = await app.controllers.BenchmarkExecutionController.get({params:{id:id_benchmarkExecution}})
                      await apis.get(`run/${id_benchmarkExecution}/${provider}/${url}/${url_path}/${concurrence}/${repetition}/1`,"benchmarker")
                      const rs = await apis.get(`results/${id_benchmarkExecution}/${provider}/${concurrence}/${repetition}`,"benchmarker")
                      await apis.get(`generateReport/${id_benchmarkExecution}/${provider}/${concurrence}/${repetition}`,"benchmarker")
                      if (rs && rs.data){
                        results[repetition][concurrence] = {...results[repetition][concurrence],...rs.data}
                      }
                    }
                    await app.controllers.BenchmarkExecutionController.update({params:{id:id_benchmarkExecution},body:{id_benchmark:benchmark.id,results:results}})
                  }
                }
            }
            await app.controllers.BenchmarkExecutionController.update({params:{id:id_benchmarkExecution},body:{id_benchmark:benchmark.id,results:results}})
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
  
  return {
    get,
    list,
    remove,
    update,
    create,
    play
  };
};
