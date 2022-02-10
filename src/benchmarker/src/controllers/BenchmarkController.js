const checkBenckmark = require('../utils/checkBenckmark')
const execShell = require('../utils/execShell')
const getResults = require('../utils/getResults')
const scriptsPath = "../scripts"
const benchmarksPath = "../benchmarks"

module.exports = (app) => {

  const run = async (req, res) => {
    try {
        const {id, provider, protocol, url, concurrence, repetition, wait} = req.params
        const {method, a, b, c, d, e, operation, url_path, activation_url, timeout} = req.body
        const body = JSON.stringify(req.body)
        const method_ = (method) ? method : ((activation_url) && activation_url.toUpperCase()) || "GET"
        const port = (url.split(":")[1]) ? url.split(":")[1] : (protocol === "https") ? "443" : "80"
        const url_ = url.split(":")[0]
        const path_ = (url_path=="default") ? "/" : url_path 
        
        if (id && provider && url && path_ && concurrence && repetition && wait){
            app.locals.execution[id] = true
            let printedWait = false
            while (app.locals.semaphore===false){
                if (!printedWait){
                    console.log(`Benchmark Execution ${id} for ${provider} repetition ${repetition} under concurrence ${concurrence} is  waiting for semaphore...`)
                    printedWait = true
                }
                await new Promise(resolve => setTimeout(resolve, 300));
            }
            if (!app.locals.execution[id]){
                console.log(`Benchmark Execution ${id} for ${provider} repetition ${repetition} under concurrence ${concurrence} was aborted`)
                return res.status(201) 
            }
            console.log(`Benchmark Execution ${id} for ${provider} will run repetition ${repetition} under concurrence ${concurrence}`)    
            app.locals.semaphore = false
            let result = null
            if (parseInt(wait)===1){
                try {
                    result = await execShell.command(`${scriptsPath}/runBenchmark.sh`,[`${benchmarksPath}/default_${activation_url}.jmx`, id, provider, protocol, url_, port, path_, concurrence, repetition, method_, ` ${a} `, ` ${b} `, ` ${c} `, ` ${d} `, ` ${e} `, ` ${operation} `,  `'${body}'`, ` ${timeout} `])
                                        .finally(e=>{
                                            console.log(e)
                                            app.locals.semaphore = true
                                        })
                    app.locals.semaphore = true
                } catch (e){
                    app.locals.semaphore = true
                }
                return res.json({"result":result})
            } else {
                try {
                    execShell.command(`${scriptsPath}/runBenchmark.sh`,[`${benchmarksPath}/default_${activation_url}.jmx`, id, provider, protocol, url, path, concurrence, repetition, method_, ` ${a} `, ` ${b} `, ` ${c} `, ` ${d} `, ` ${e} `, ` ${operation} `,  `'${body}'`, ` ${timeout} `]).then(res=>{
                        app.locals.semaphore = true
                    })
                    .finally(e=>{
                        console.log(e)
                        app.locals.semaphore = true
                    })
                } catch (e){
                    app.locals.semaphore = true
                }
                return res.json({"info":"Benchmark requested"})
            }

        } else {
            return res.status(400).json({"info":"Missing parameters"})
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json(`error: ${error}`)
    }
  };

  const cancel = async (req, res) => {
    try {
        const {id} = req.params
        if (id ){
            app.locals.execution[id] = false
            return res.status(200).json({"info":"canceled"})
        } else {
            return res.status(400).json({"info":"Missing parameters"})
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json(`error: ${error}`)
    }
  };

  const generateReport = async (req, res) => {
    try {
        const {id, provider, concurrence, repetition} = req.params
        if (id && provider && concurrence && repetition){
            let check = await checkBenckmark.exists(id, provider, concurrence, repetition)
            if (check){
                const result = await execShell.command(`${scriptsPath}/generateReport.sh`,[id, provider, concurrence, repetition], true)
                if (result){
                    return res.json({"report_url":`reports/${id}/${provider}/${concurrence}/${repetition}`})
                } else {
                    return res.status(500).json({"error":"Fail to generate the report"})    
                }
            } else {
                return res.status(404).json({"info":"Benchmark not found"})
            }
        } else {
            return res.status(400).json({"info":"Missing parameters"})
        }
    } catch (error) {
        return res.status(500).json(`error: ${error}`)
    }
  };

  const generateReportByCsv = async (req, res) => {
    try {
        const {uuid} = req.params
        if (uuid){
            const result = await execShell.command(`${scriptsPath}/generateReportByCsv.sh`,[uuid], true)
            if (result){
                return res.json({"report_url":`reports/${uuid}`})
            } else {
                return res.status(500).json({"error":"Fail to generate the report"})    
            }
        } else {
            return res.status(400).json({"info":"Missing parameters"})
        }
    } catch (error) {
        return res.status(500).json(`error: ${error}`)
    }
  };

  const results = async (req, res) => {
    try {
        const {id, provider, concurrence, repetition} = req.params
        if (id && provider && concurrence && repetition){
            let check = await checkBenckmark.exists(id, provider, concurrence, repetition)
            if (check){
                const result = await getResults.json(id, provider, concurrence, repetition)
                return res.json(result) 
            } else {
                return res.status(404).json({"info":"Benchmark not found"})
            }
        } else {
            return res.status(400).json({"info":"Missing parameters"})
        }
    } catch (error) {
        return res.status(500).json(`error: ${error}`)
    }
  };

  return {
    run,
    cancel,
    generateReport,
    generateReportByCsv,
    results
  };
};
