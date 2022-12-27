const express = require("express");
const consign = require("consign");
const db = require("./database/connection");
const environment = require("./config/environment")
const http = require('http')
const app = express();
const apiVersion = environment.configuration.apiVersion
const basePath = `/backend/api/v${apiVersion}`;
app.basePath = basePath
app.db = db;
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb',extended: true}));
app.use('/csvs', express.static('/csvs'));
app.use('/jsons', express.static('/jsons'));

app.get('/', function(req, res) {
  res.redirect(`/backend/api-doc`);
});

consign({ cwd: "src" })
  .then("./config/middlewares.js")
  .then("./config/errors.js")
  .then("./utils")
  .then("./controllers")
  .then("./swagger/swagger.js")
  .then(`.${basePath}/routes.js`)
  .into(app);

//Bind Kafka Consumers
app.controllers.WorkerController.bindHealthCheck()
app.controllers.BenchmarkExecutionPartialResultController.bindPartialResults()
  
// Start server
http.createServer(app).listen(environment.configuration.port)
console.log(`Service: ${environment.configuration.serviceName}`)
console.log(`Port: ${environment.configuration.port}`)
console.log(`Environment: ${environment.configuration.environment}`)
console.log(`Database Host: ${environment.configuration.dbhost}:${environment.configuration.dbport}`)
console.log(`Database: ${environment.configuration.dbname} -> ${environment.configuration.dbclient}`)
console.log(`Api Version: ${apiVersion}`)
console.log(`Date: `+new Date().toString())
module.exports = app; // for testing
