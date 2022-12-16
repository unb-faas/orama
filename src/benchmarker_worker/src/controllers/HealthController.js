const apis = require('../utils/apis')
const WORKER_NAME = process.env.WORKER_NAME || "default"
const BACKEND_URL = process.env.BACKEND_URL

const healthcheck = (uuid) => {
    apis.put(`worker/hc/${uuid}` ,{name:WORKER_NAME})
}
  
exports.healthcheck = healthcheck