
/**
 * Swagger documentation provided by swagger-autogen (https://www.npmjs.com/package/swagger-autogen) 
 */

const express = require('express');
const router = express.Router();

module.exports = (app) => {       
    
  /*******************************************
  *                   Info
  ********************************************/
  router
    .route(`/status/:id/:usecase`)
    .get(
      app.controllers.ScriptsController.getStatus
      /* >>> SWAGGER DOCUMENTATION (DONT DELETE) <<<
        #swagger.tags = ['Default']
        #swagger.responses[200] = {description: "Successful"}
        #swagger.responses[400] = {description: "Wrong request"}
        #swagger.responses[500] = {description: "Server failure"}
      */
        
    ) 
  router
    .route(`/urls/:id/:usecase`)
    .get(
      app.controllers.ScriptsController.getUrls
      /* >>> SWAGGER DOCUMENTATION (DONT DELETE) <<<
        #swagger.tags = ['Default']
        #swagger.responses[200] = {description: "Successful"}
        #swagger.responses[400] = {description: "Wrong request"}
        #swagger.responses[500] = {description: "Server failure"}
      */
        
    ) 

  router
    .route(`/provision/:id/:usecase`)
    .get(
      app.controllers.ScriptsController.provision
      /* >>> SWAGGER DOCUMENTATION (DONT DELETE) <<<
        #swagger.tags = ['Default']
        #swagger.responses[200] = {description: "Successful"}
        #swagger.responses[400] = {description: "Wrong request"}
        #swagger.responses[500] = {description: "Server failure"}
      */
        
    ) 

  router
    .route(`/unprovision/:id/:usecase`)
    .get(
      app.controllers.ScriptsController.unprovision
      /* >>> SWAGGER DOCUMENTATION (DONT DELETE) <<<
        #swagger.tags = ['Default']
        #swagger.responses[200] = {description: "Successful"}
        #swagger.responses[400] = {description: "Wrong request"}
        #swagger.responses[500] = {description: "Server failure"}
      */
        
    ) 
    
  app.use(app.basePath, router);
};
