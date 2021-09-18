
const express = require('express')
const app = express()
const port = 3200
const { exec } = require("child_process");


function checkUsecaseExists(useCase){
    return new Promise((resolve, reject) => {
        exec(`./checkUsecaseExists.sh ${useCase}`, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }

            if (stdout.includes("true")) {
                resolve(true)
            } else {
                resolve(false)
            }
            console.log(`stdout: -->${stdout}<---`);
        });
    })
}

function checkProvisionExists(id, useCase){
    return new Promise((resolve, reject) => {
        exec(`./checkProvisionExists.sh ${id} ${useCase}`, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }

            if (stdout.includes("true")) {
                resolve(true)
            } else {
                resolve(false)
            }
            console.log(`stdout: -->${stdout}<---`);
        });
    })
}

function createProvisionFolder($id, useCase){
    return new Promise((resolve, reject) => {
        exec(`./createProvisionFolder.sh ${$id} ${useCase}`, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }

            if (stdout.includes("true")) {
                resolve(true)
            } else {
                resolve(false)
            }
            console.log(`stdout: -->${stdout}<---`);
        });
    })
}

function provision(id, useCase){
    return new Promise((resolve, reject) => {
        exec(`./provision.sh ${id} ${useCase}`, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            if (stdout.includes("true")) {
                resolve(true)
            } else {
                resolve(false)
            }
            console.log(`stdout: ${stdout}`);
        });
    })
}

function unprovision(id, useCase){
    return new Promise((resolve, reject) => {
        exec(`./unprovision.sh ${id} ${useCase}`, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            if (stdout.includes("true")) {
                resolve(true)
            } else {
                resolve(false)
            }
            console.log(`stdout: ${stdout}`);
        });
    })
}

function getUrls(id, useCase){
    return new Promise((resolve, reject) => {
        exec(`./getUrls.sh ${id} ${useCase}`, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            resolve(stdout)
            console.log(`stdout: ${stdout}`);
        });
    })
}

function getStatus(id, useCase){
    return new Promise((resolve, reject) => {
        exec(`./getStatus.sh ${id} ${useCase}`, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            resolve(stdout)
            console.log(`stdout: ${stdout}`);
        });
    })
}


app.get('/provision', async (req, res) => {
  let { id, useCase } = req.query
  if (id && useCase){
    let result = await checkUsecaseExists(useCase)
    if (result){
        result = null
        result = await createProvisionFolder(id, useCase)
        if (result){
            provision(id, useCase)
            res.json({"info":"Provision started"}) 
        } else {
            res.status(500).json({"error":"Error on folder creation"})
        }
    } else {
        res.status(404).json({"error":"Use case was not found"})
    }
  } else {
    res.status(500).json({"error":"generic"})
  }
})  

app.get('/unprovision', async (req, res) => {
    let { id, useCase } = req.query
    if (id && useCase){
      let result = await checkUsecaseExists(useCase)
      if (result){
          unprovision(id, useCase)
          res.json({"info":"Unprovision started"})
      } else {
          res.status(404).json({"error":"Use case was not found"})
      }
    } else {
      res.status(500).json({"error":"generic"})
    }
  })  

app.get('/urls', async (req, res) => {
    let { id, useCase } = req.query
    if (id && useCase){
      let result = await checkProvisionExists(id, useCase)
      if (result){
        result = null
        result = await getUrls(id, useCase)
        try{
            res.json(JSON.parse(result)) 
        } catch (e){
            console.log(e)
            res.status(500).json({"error":e})     
        }
      } else {
          res.status(404).json({"error":"Provision was not found"}) 
      }
    } else {
      res.status(500).json({"error":"generic"})
    }
  })  

app.get('/status', async (req, res) => {
    let { id, useCase } = req.query
    if (id && useCase){
      let result = await checkProvisionExists(id, useCase)
      if (result){
        result = null
        result = await getStatus(id, useCase)
        try{
            res.json(JSON.parse(result)) 
        } catch (e){
            console.log(e)
            res.status(500).json({"error":e})     
        }
      } else {
          res.status(404).json({"error":"Provision was not found"}) 
      }
    } else {
      res.status(500).json({"error":"generic"})
    }
  })  


  app.listen(port, () => {
    console.log(`API on port ${port}`)
  })
