const fs = require('fs')
const hasha = require('hasha');
const swaggerAutogen = require('swagger-autogen')()
const swaggerUi = require("swagger-ui-express")
const swaggerOutput = "swagger.json"
const swaggerOutputTemp = "swagger_temp.json"
const outputFile = `./swagger/${swaggerOutput}`
const outputTempFile = `./swagger/${swaggerOutputTemp}`
const port = 3100
const endpointsFiles = [`./routes.js`]
const outputInitialSettings = {
  host: `localhost:${port}`,    
  schemes: ['http'],
  info: {
    "title": "Orama Benchmarker API"
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
  app.use('/benchmarker/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))
}

module.exports = async (app) => {        
  await generateOutput()
  await readOutput(app)
};