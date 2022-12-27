const WORKER_NAME = process.env.WORKER_NAME || "default"
const KafkaController = require('./KafkaController')

const healthcheck = (uuid) => {
    KafkaController.produce('WorkersHealth',{   
                                                value:JSON.stringify({"name":WORKER_NAME, "uuid":uuid})
                                            })
}
  
exports.healthcheck = healthcheck