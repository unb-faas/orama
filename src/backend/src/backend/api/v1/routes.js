
/**
 * Swagger documentation provided by swagger-autogen (https://www.npmjs.com/package/swagger-autogen) 
 */

const config = require("../../../config/environment");
const express = require('express');
const router = express.Router();
function makeCallbackList(list,keycloak,checkRoles){
  if (apiProtected){
    let new_list = [keycloak.protect(checkRoles)]
    return new_list.concat(list) 
  }
  return list
}

module.exports = (app) => {       
    
  /*******************************************
  *                   Info
  ********************************************/
  router
    .route(`/info`)
    .get(
      app.controllers.InfoController.info
      /* >>> SWAGGER DOCUMENTATION (DONT DELETE) <<<
        #swagger.tags = ['Tools']
        #swagger.responses[200] = {
          description: "Successful"
        }
        */
    )   
  
  /*******************************************
  *                   Provider
  ********************************************/
  router
  .route(`/provider`)
    .get(
      app.controllers.ProviderController.list
      /* >>> SWAGGER DOCUMENTATION (DONT DELETE) <<<
        #swagger.tags = ['Provider']
        #swagger.responses[200] = { description: "Successful"}
        #swagger.responses[500] = { description: "Error on server"}
        #swagger.parameters['page'] = {
                description: 'page',
                in: 'query',
                required: false
            }
         #swagger.parameters['size'] = {
                description: 'size',
                in: 'query',
                required: false
            }
        */
    )
    .post(
      app.controllers.ProviderController.create
      /* >>> SWAGGER DOCUMENTATION (DONT DELETE) <<<
        #swagger.tags = ['Provider']
        #swagger.responses[200] = { description: "Successful"}
        #swagger.responses[500] = { description: "Error on server"}
        #swagger.parameters['type'] = {
             in: 'body',
             type: "object",
             description: "new object",
             schema: {
                    name:"",
                    acronym: "",
                    active: 0
                   }
           }
      */
    )
  router
  .route(`/provider/:id`)
    .get(
      app.controllers.ProviderController.get
      /* >>> SWAGGER DOCUMENTATION (DONT DELETE) <<<
        #swagger.tags = ['Provider']
        #swagger.responses[200] = { description: "Successful"}
        #swagger.responses[404] = { description: "Not Found" }
        #swagger.responses[500] = { description: "Error on server"}
      */
    )
    .put(
      app.controllers.ProviderController.update
      /* >>> SWAGGER DOCUMENTATION (DONT DELETE) <<<
        #swagger.tags = ['Provider']
        #swagger.responses[200] = { description: "Successful"}
        #swagger.responses[404] = { description: "Not Found" }
        #swagger.responses[500] = { description: "Error on server"}
        #swagger.parameters['type'] = {
            in: 'body',
            type: "object",
            description: "update object",
            schema: {
                  name:"",
                  acronym: "",
                  active: 0
                  }
          }
       */
    )
    .delete(
      app.controllers.ProviderController.remove
      /* >>> SWAGGER DOCUMENTATION (DONT DELETE) <<<
        #swagger.tags = ['Provider']
        #swagger.responses[200] = { description: "Successful"}
        #swagger.responses[404] = { description: "Not Found" }
        #swagger.responses[500] = { description: "Error on server"}
        */
    )


  /*******************************************
  *                   Use Case
  ********************************************/
   router
   .route(`/usecase`)
     .get(
       app.controllers.UseCaseController.list
       /* >>> SWAGGER DOCUMENTATION (DONT DELETE) <<<
         #swagger.tags = ['Use Case']
         #swagger.responses[200] = { description: "Successful"}
         #swagger.responses[500] = { description: "Error on server"}
         #swagger.parameters['page'] = {
                description: 'page',
                in: 'query',
                required: false
            }
         #swagger.parameters['size'] = {
                description: 'size',
                in: 'query',
                required: false
            }
         */
     )
     .post(
       app.controllers.UseCaseController.create
       /* >>> SWAGGER DOCUMENTATION (DONT DELETE) <<<
         #swagger.tags = ['Use Case']
         #swagger.responses[200] = { description: "Successful"}
         #swagger.responses[500] = { description: "Error on server"}
         #swagger.parameters['type'] = {
              in: 'body',
              type: "object",
              description: "new object",
              schema: {
                     name:"",
                     acronym: "",
                     active: 0
                    }
            }
       */
     )
   router
   .route(`/usecase/:id`)
     .get(
       app.controllers.UseCaseController.get
       /* >>> SWAGGER DOCUMENTATION (DONT DELETE) <<<
         #swagger.tags = ['Use Case']
         #swagger.responses[200] = { description: "Successful"}
         #swagger.responses[404] = { description: "Not Found" }
         #swagger.responses[500] = { description: "Error on server"}
       */
     )
     .put(
       app.controllers.UseCaseController.update
       /* >>> SWAGGER DOCUMENTATION (DONT DELETE) <<<
         #swagger.tags = ['Use Case']
         #swagger.responses[200] = { description: "Successful"}
         #swagger.responses[404] = { description: "Not Found" }
         #swagger.responses[500] = { description: "Error on server"}
         #swagger.parameters['type'] = {
             in: 'body',
             type: "object",
             description: "update object",
             schema: {
                   name:"",
                   acronym: "",
                   active: 0
                   }
           }
        */
     )
     .delete(
       app.controllers.UseCaseController.remove
       /* >>> SWAGGER DOCUMENTATION (DONT DELETE) <<<
         #swagger.tags = ['Use Case']
         #swagger.responses[200] = { description: "Successful"}
         #swagger.responses[404] = { description: "Not Found" }
         #swagger.responses[500] = { description: "Error on server"}
         */
     )


  /*******************************************
  *                   Benchmark
  ********************************************/
  router
   .route(`/benchmark/:id/play`)
     .get(
       app.controllers.BenchmarkController.play
       /* >>> SWAGGER DOCUMENTATION (DONT DELETE) <<<
         #swagger.tags = ['Benchmark']
         #swagger.responses[200] = { description: "Successful"}
         #swagger.responses[500] = { description: "Error on server"}
         */
     )

  router
   .route(`/benchmark`)
     .get(
       app.controllers.BenchmarkController.list
       /* >>> SWAGGER DOCUMENTATION (DONT DELETE) <<<
         #swagger.tags = ['Benchmark']
         #swagger.responses[200] = { description: "Successful"}
         #swagger.responses[500] = { description: "Error on server"}
         #swagger.parameters['page'] = {
                description: 'page',
                in: 'query',
                required: false
            }
         #swagger.parameters['size'] = {
                description: 'size',
                in: 'query',
                required: false
            }
         */
     )
     .post(
       app.controllers.BenchmarkController.create
       /* >>> SWAGGER DOCUMENTATION (DONT DELETE) <<<
         #swagger.tags = ['Benchmark']
         #swagger.responses[200] = { description: "Successful"}
         #swagger.responses[500] = { description: "Error on server"}
         #swagger.parameters['type'] = {
             in: 'body',
             type: "object",
             description: "update object",
             schema: {
              "concurrences": {
                "list": [
                  10,
                  100,
                  1000
                ]
              },
              "repetitions": 10,
              "provision_status": 0,
              "provision_url": "",
              "id_usecase": 2,
              "id_provider": 2
            }
          }
         
       */
     )
   router
   .route(`/benchmark/:id`)
     .get(
       app.controllers.BenchmarkController.get
       /* >>> SWAGGER DOCUMENTATION (DONT DELETE) <<<
         #swagger.tags = ['Benchmark']
         #swagger.responses[200] = { description: "Successful"}
         #swagger.responses[404] = { description: "Not Found" }
         #swagger.responses[500] = { description: "Error on server"}
       */
     )
     .put(
       app.controllers.BenchmarkController.update
       /* >>> SWAGGER DOCUMENTATION (DONT DELETE) <<<
         #swagger.tags = ['Benchmark']
         #swagger.responses[200] = { description: "Successful"}
         #swagger.responses[404] = { description: "Not Found" }
         #swagger.responses[500] = { description: "Error on server"}
         #swagger.parameters['type'] = {
             in: 'body',
             type: "object",
             description: "update object",
             schema: {
              "concurrences": {
                "list": [
                  10,
                  100,
                  1000
                ]
              },
              "repetitions": 10,
              "provision_status": 0,
              "provision_url": "",
              "id_usecase": 2,
              "id_provider": 2
            }
          }
        */
     )
     .delete(
       app.controllers.BenchmarkController.remove
       /* >>> SWAGGER DOCUMENTATION (DONT DELETE) <<<
         #swagger.tags = ['Benchmark']
         #swagger.responses[200] = { description: "Successful"}
         #swagger.responses[404] = { description: "Not Found" }
         #swagger.responses[500] = { description: "Error on server"}
         */
     )

     /*******************************************
  *                   Benchmark Execution
  ********************************************/
   router
   .route(`/benchmarkExecution`)
     .get(
       app.controllers.BenchmarkExecutionController.list
       /* >>> SWAGGER DOCUMENTATION (DONT DELETE) <<<
         #swagger.tags = ['Benchmark Execution']
         #swagger.responses[200] = { description: "Successful"}
         #swagger.responses[500] = { description: "Error on server"}
         #swagger.parameters['page'] = {
                description: 'page',
                in: 'query',
                required: false
            }
         #swagger.parameters['size'] = {
                description: 'size',
                in: 'query',
                required: false
            }
         #swagger.parameters['id_benchmark'] = {
                description: 'Benchmark id',
                in: 'query',
                required: false
            }
         */
     )
     .post(
       app.controllers.BenchmarkExecutionController.create
       /* >>> SWAGGER DOCUMENTATION (DONT DELETE) <<<
         #swagger.tags = ['Benchmark Execution']
         #swagger.responses[200] = { description: "Successful"}
         #swagger.responses[500] = { description: "Error on server"}
         #swagger.parameters['type'] = {
             in: 'body',
             type: "object",
             description: "update object",
             schema: {
              "results": {},
              "id_benchmark": 1,
            }
          }
         
       */
     )
   router
   .route(`/benchmarkExecution/:id`)
     .get(
       app.controllers.BenchmarkExecutionController.get
       /* >>> SWAGGER DOCUMENTATION (DONT DELETE) <<<
         #swagger.tags = ['Benchmark Execution']
         #swagger.responses[200] = { description: "Successful"}
         #swagger.responses[404] = { description: "Not Found" }
         #swagger.responses[500] = { description: "Error on server"}
       */
     )
     .put(
       app.controllers.BenchmarkExecutionController.update
       /* >>> SWAGGER DOCUMENTATION (DONT DELETE) <<<
         #swagger.tags = ['Benchmark Execution']
         #swagger.responses[200] = { description: "Successful"}
         #swagger.responses[404] = { description: "Not Found" }
         #swagger.responses[500] = { description: "Error on server"}
         #swagger.parameters['type'] = {
             in: 'body',
             type: "object",
             description: "update object",
             schema: {
              "results": {},
              "id_benchmark": 1,
            }
          }
        */
     )
     .delete(
       app.controllers.BenchmarkExecutionController.remove
       /* >>> SWAGGER DOCUMENTATION (DONT DELETE) <<<
         #swagger.tags = ['Benchmark Execution']
         #swagger.responses[200] = { description: "Successful"}
         #swagger.responses[404] = { description: "Not Found" }
         #swagger.responses[500] = { description: "Error on server"}
         */
     )


  app.use(app.basePath, router);
};
