const checkBenckmark = require('../utils/checkBenckmark')
const execShell = require('../utils/execShell')
const getResults = require('../utils/getResults')
const scriptsPath = "../scripts"
const benchmarksPath = "../benchmarks"

module.exports = (app) => {

  const run = async (req, res) => {
    try {
        const {id, provider, url, path, concurrence, repetition, wait} = req.params
        const {port, method, a, b, c, d, e, operation, body} = req.query
        let method_ = (method) ? method : "GET"
        let port_ = (port) ? port : 443

        if (id && provider && url && path && concurrence && repetition && wait){
            let result = null
            if (parseInt(wait)===1){
                result = await execShell.command(`${scriptsPath}/runBenchmark.sh`,[`${benchmarksPath}/default.jmx`, id, provider, url, port_, path, concurrence, repetition, method_, ` ${a} `, ` ${b} `, ` ${c} `, ` ${d} `, ` ${e} `, ` ${operation} `, body])
                return res.json({"result":result})
            } else {
                execShell.command(`${scriptsPath}/runBenchmark.sh`,[`${benchmarksPath}/default.jmx`, id, provider, url, path, concurrence, repetition])
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
    results
  };
};
