/*const express = require('express')
const consign = require("consign");

const app = express()
app.basePath = "/"
const port = 3100
app.locals.semaphore = true
app.locals.execution = {}

app.use('/reports', express.static('/reports'));

consign()
    .then("./config/middlewares.js")
    .then("./swagger/swagger.js")
    .then("./controllers")
    .then("./routes.js")
    .into(app);

app.get('/', function(req, res) {
    res.redirect('/benchmarker/api-doc');
});

app.listen(port, () => {
    console.log(`API on port ${port}`)
})*/

const fs = require('fs')
const { v4: uuidv4 } = require('uuid');
const apis = require('./utils/apis')

const heathcheck_interval = 5000
const WORKER_NAME = process.env.WORKER_NAME || "default"
const BACKEND_URL = process.env.BACKEND_URL
const KAFKA_URL = process.env.KAFKA_URL

const heathcheck = () => {
    const uuidFile = "/tmp/uuid"
    if (!fs.existsSync(uuidFile)) {
        const uuid = uuidv4()
        fs.writeFileSync(uuidFile, uuid)
    }
    const uuidFromFile = fs.readFileSync(uuidFile, {encoding:'utf8', flag:'r'})
    console.log(uuidFromFile)
    apis.put(`worker/hc/${uuidFromFile}` ,{name:WORKER_NAME})
}
  
setInterval(heathcheck, heathcheck_interval);