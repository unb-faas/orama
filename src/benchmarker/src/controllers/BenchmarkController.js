const checkBenckmark = require('../utils/checkBenckmark')
const execShell = require('../utils/execShell')
const getResults = require('../utils/getResults')
const scriptsPath = "../scripts"
const benchmarksPath = "../benchmarks"

module.exports = (app) => {

  const run = async (req, res) => {
    try {
        const {id, provider, protocol, url, concurrence, repetition, wait} = req.params
        const {method, a, b, c, d, e, operation, url_path, activation_url} = req.body
        const body = JSON.stringify(req.body)
        const method_ = (method) ? method : ((activation_url) && activation_url.toUpperCase()) || "GET"
        const port = (url.split(":")[1]) ? url.split(":")[1] : (protocol === "https") ? "443" : "80"
        const url_ = url.split(":")[0]
        const path_ = (url_path=="default") ? "/" : url_path 
        
        if (id && provider && url && path_ && concurrence && repetition && wait){
            while (app.locals.semaphore===false){
                console.log(`Benchmark ${id} for ${provider} is  waiting for semaphore...`)
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            app.locals.semaphore = false
            let result = null
            if (parseInt(wait)===1){
                result = await execShell.command(`${scriptsPath}/runBenchmark.sh`,[`${benchmarksPath}/default_${activation_url}.jmx`, id, provider, protocol, url_, port, path_, concurrence, repetition, method_, ` ${a} `, ` ${b} `, ` ${c} `, ` ${d} `, ` ${e} `, ` ${operation} `,  `'${body}'` ])
                                        .catch(e=>{
                                            console.log(e)
                                            app.locals.semaphore = true
                                        })
                app.locals.semaphore = true
                return res.json({"result":result})
            } else {
                execShell.command(`${scriptsPath}/runBenchmark.sh`,[`${benchmarksPath}/default_${activation_url}.jmx`, id, provider, protocol, url, path, concurrence, repetition]).then(res=>{
                    app.locals.semaphore = true
                })
                .catch(e=>{
                    console.log(e)
                    app.locals.semaphore = true
                })
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
    generateReport,
    generateReportByCsv,
    results
  };
};
