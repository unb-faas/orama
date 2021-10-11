
/**
 * Swagger documentation provided by swagger-autogen (https://www.npmjs.com/package/swagger-autogen) 
 */

const express = require('express');
const router = express.Router();

module.exports = (app) => {       
    
  /*******************************************
  *                   Benchmark
  ********************************************/
  router
    .route(`/run/:id/:provider/:url/:path/:concurrence/:repetition/:wait`)
    .get(
      app.controllers.BenchmarkController.run
      /* >>> SWAGGER DOCUMENTATION (DONT DELETE) <<<
        #swagger.tags = ['Default']
        #swagger.responses[200] = {description: "Successful"}
        #swagger.responses[400] = {description: "Wrong request"}
        #swagger.responses[500] = {description: "Server failure"}
      */
        
    ) 

  router
    .route(`/generateReport/:id/:provider/:concurrence/:repetition/`)
    .get(
      app.controllers.BenchmarkController.generateReport
      /* >>> SWAGGER DOCUMENTATION (DONT DELETE) <<<
        #swagger.tags = ['Default']
        #swagger.responses[200] = {description: "Successful"}
        #swagger.responses[400] = {description: "Wrong request"}
        #swagger.responses[500] = {description: "Server failure"}
      */
    ) 

  router
    .route(`/generateReportByCsv/:uuid/`)
    .get(
      app.controllers.BenchmarkController.generateReportByCsv
      /* >>> SWAGGER DOCUMENTATION (DONT DELETE) <<<
        #swagger.tags = ['Default']
        #swagger.responses[200] = {description: "Successful"}
        #swagger.responses[400] = {description: "Wrong request"}
        #swagger.responses[500] = {description: "Server failure"}
      */
    ) 
  
  router
    .route(`/results/:id/:provider/:concurrence/:repetition/`)
    .get(
      app.controllers.BenchmarkController.results
      /* >>> SWAGGER DOCUMENTATION (DONT DELETE) <<<
        #swagger.tags = ['Default']
        #swagger.responses[200] = {description: "Successful"}
        #swagger.responses[400] = {description: "Wrong request"}
        #swagger.responses[500] = {description: "Server failure"}
      */
    ) 
  
    
  app.use(app.basePath, router);
};
