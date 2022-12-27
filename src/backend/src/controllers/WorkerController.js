const dao = require('../dao/WorkerDAO')

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
        delete req.body.health
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
        delete req.body.health
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

  const healthCheck = async (req, res) => {
    try {
        const { uuid } = req.params
        const { name } = req.body
        const worker = await dao.getByUUID(uuid)
        let result = null
        if (worker && worker.id){
          worker.last_up_at = new Date().toISOString()
          delete worker.health
          result = await dao.update(worker.id,worker)
        } else {
          worker.uuid = uuid
          worker.name = name
          worker.active = 1
          result = await dao.create(worker)
        }
        let status_code = 200
        if (!result){
          status_code = 404
        }
        return (res) ? res.status(status_code).json(result) : result;        
      } catch (error) {
        return res.status(500).json(`Error: ${error}`)
    }  
  };

  
  const bindHealthCheck = async () =>{
    const topic = "WorkersHealth"
    app.controllers.WorkerSchedulerController.bindKafkaConsumerWorkers(topic, "oramaHealthCheck", async ({ topic, partition, message }) => {
        console.log("Received healthcheck from",message.value.toString())
        processHealthCheck(message.value.toString())
    })
  }

  const processHealthCheck = async (string) => {
    try {
        const { uuid, name } = JSON.parse(string)
        const worker = await dao.getByUUID(uuid)
        let result = null
        if (worker && worker.id){
          worker.last_up_at = new Date().toISOString()
          delete worker.health
          result = await dao.update(worker.id,worker)
        } else {
          worker.uuid = uuid
          worker.name = name
          worker.active = 1
          result = await dao.create(worker)
        }
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
    healthCheck,
    bindHealthCheck
  };
};
