const dao = require('../dao/BenchmarkExecutionPartialResultDAO')

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
        req.body.created_at = new Date().toISOString()
        const result = await dao.create(req.body)
        return res ? res.json(result) : result;
    } catch (error) {
        console.error(error)
        return (res) ? res.status(500).json(`Error: ${error}`) : false
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

  const bindPartialResults = async () =>{
    const topic = "PartialResults"
    app.controllers.WorkerSchedulerController.bindKafkaConsumerWorkers(topic, "oramaPartialResult", async ({ topic, partition, message }) => {
        processPartialResults(message.value.toString())
    })
  }

  const processPartialResults = async (string) => {
    try {
        const body = JSON.parse(string)
        await create({body:body})
    } catch (error) {
        console.error(error)
    }  
  };
  
  return {
    get,
    list,
    remove,
    update,
    create,
    bindPartialResults
  };
};
