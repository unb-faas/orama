const fs = require('fs')
const hasha = require('hasha');
const swaggerAutogen = require('swagger-autogen')()
const environment = require("../config/environment");
const swaggerUi = require("swagger-ui-express")
const swaggerOutput = "swagger.json"
const swaggerOutputTemp = "swagger_temp.json"
const outputFile = `./src/swagger/${swaggerOutput}`
const outputTempFile = `./src/swagger/${swaggerOutputTemp}`
const host = `${environment.configuration.host}`
const port = `${environment.configuration.port}`
const basePath = `api/v${environment.configuration.apiVersion}`;
const endpointsFiles = [`./src/backend/${basePath}/routes.js`]
const keycloak_client_secret = environment.configuration.keycloak_client_secret
const keycloak_url = environment.configuration.keycloak_url
const outputInitialSettings = {
  basePath: `/${basePath}/`,
  host: `${host}:${port}/backend`.replace('http://',''),    
  schemes: ['http'],
  info: {
    "title": "Orama Backend API"
  },
}
async function generateOutput () {
  await swaggerAutogen(outputTempFile, endpointsFiles, outputInitialSettings)  
    
  if (!fs.existsSync(outputTempFile)) {    
    throw `Swagger temp file was not created [${outputTempFile}]`
  }
    
  if (fs.existsSync(outputFile)) {      
    const hashOld = await hasha.fromFile(outputFile, {algorithm: 'md5'});
    const hashNew = await hasha.fromFile(outputTempFile, {algorithm: 'md5'});    
    if(hashOld === hashNew) {
        return
    }          
  }  
    
  fs.renameSync(outputTempFile, outputFile) 
}

async function readOutput (app) {
  const swaggerFile = require(`./${swaggerOutput}`)
  app.use('/backend/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))
}

module.exports = async (app) => {        
  await generateOutput()
  await readOutput(app)
};