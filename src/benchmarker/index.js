
const express = require('express')
const app = express()
const port = 3100
const { exec } = require("child_process");
const csv = require("csvtojson");



function getResults(id, concurrence, repetitions, provider){
    return new Promise((resolve, reject) => {
        csv()
            .fromFile(`/results/${id}/${provider}/${concurrence}/${repetitions}/result.csv`)
            .then(function(jsonArrayObj){ //when parse finished, result will be emitted here.
                resolve(jsonArrayObj); 
        })
    })
}

function runBenchmark(id, url, url_path, concurrence, repetitions, provider){
    exec(`./runBenchmark.sh ${id} ${url} ${url_path} ${concurrence} ${repetitions} ${provider}`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
}

function generateReport(csvPath, outputName){
    exec(`./generateReport.sh ${csvPath} ${outputName}`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
}

app.get('/runBenchmark', (req, res) => {
  let { id, url, url_path, concurrence, repetitions, provider } = req.query
  if (id && url && url_path && concurrence && repetitions && provider){
    runBenchmark(id, url, url_path, concurrence, repetitions, provider)
    res.send(`Benchmark started: Id: ${id}, Url: ${url}${url_path}, Concurrence: ${concurrence}, Repetitions: ${repetitions}, Provider: ${provider}`)
  } else {
    res.status(500).send(`Error`)
  }
})

app.get('/generateReport', (req, res) => {
    let { csvPath, outputName } = req.query
    if (csvPath && outputName ){
        generateReport(csvPath, outputName)
        res.send(`Repport Generated`)
    } else {
        res.status(500).send(`Error`)
    }
    
  })

  app.get('/results', async (req, res) => {
    let { id, concurrence, repetitions, provider } = req.query
    if (id && concurrence && repetitions && provider){
        const results = await getResults(id, concurrence, repetitions, provider)
        res.send(results)
    } else {
        res.status(500).send(`Error`)
    }
    
  })
  

app.listen(port, () => {
  console.log(`API on port ${port}`)
})

