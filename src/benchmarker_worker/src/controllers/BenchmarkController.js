const checkBenckmark = require('../utils/checkBenckmark')
const execShell = require('../utils/execShell')
const getResults = require('../utils/getResults')
const scriptsPath = "../scripts"
const benchmarksPath = "../benchmarks"
const csv = require("csvtojson");
const apis = require('../utils/apis')
const KafkaController = require('./KafkaController')

  const run = async (parameters, uuid) => {
    try {
        if (typeof parameters == 'undefined'){
            console.error("Error: parameters is undefined")
            return false

        }
        const checkParameters = ['id','provider','protocol','url','requests','concurrence','repetition','url_path','activation_url','wait']
        const missingParameters = checkParameters.filter(param => !(param in parameters))
        if (missingParameters.length>0){
            console.error("Error: some required parameters are missing", missingParameters )
            return false
        }
        const {id, provider, protocol, url, concurrence, repetition, wait, requests} = parameters
        const {method, a, b, c, d, e, operation, url_path, activation_url, timeout} = parameters        
        const body = JSON.stringify(parameters.body)
        const method_ = (method) ? method : ((activation_url) && activation_url.toUpperCase()) || "GET"
        const port = (url.split(":")[1]) ? url.split(":")[1] : (protocol === "https") ? "443" : "80"
        const url_ = url.split(":")[0]
        const path_ = (url_path=="default") ? "/" : url_path
        // Since all required parameters are OK, them go to the tests
        if (id && provider && url && path_ && concurrence && repetition && wait && requests){
            let printedWait = false
            console.log(`Benchmark Execution ${id} for ${provider} will run repetition ${repetition} for concurrence ${concurrence} under ${requests} simultaneous`)    
            let result = null
            try {
                // Run the tests with JMeter
                result = await execShell.command(`${scriptsPath}/runBenchmark.sh`,[`${benchmarksPath}/default_${activation_url}.jmx`, id, provider, protocol, url_, port, path_, requests, repetition, method_, ` ${a} `, ` ${b} `, ` ${c} `, ` ${d} `, ` ${e} `, ` ${operation} `,  `'${body}'`, ` ${timeout} `])
                                    .finally(e=>{
                                        console.log(e)
                                    })
                // Load CSV results file from filesystem
                const csvFilePath = `/results/${id}/${provider}/${requests}/${repetition}/result.csv`
                csv()
                    .fromFile(csvFilePath)
                    .then(async results => {
                        const partialResults = {
                            id_benchmark_execution: id,
                            worker_uuid: uuid,
                            concurrence: concurrence,
                            repetition: repetition,
                            requests: requests,
                            results: {list:results}
                        }
                        console.log("Sending results to master via Kakfa")
                        // Send results to main server
                        await KafkaController.produce("PartialResults",{   
                            value:JSON.stringify(partialResults)
                        })
                    })
            } catch (e){
                console.error(e)
            }
            return {"result":result}
        } else {
            console.error({"info":"Missing parameters"})
            return {"info":"Missing parameters"}
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json(`error: ${error}`)
    }
  };
  exports.run = run
