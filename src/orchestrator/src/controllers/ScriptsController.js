const execShell = require('../utils/execShell')
const apis = require('../utils/apis')
const scriptsPath = "../scripts"
module.exports = (app) => {

  const getStatus = async (req, res) => {
    try {
        const {id, usecase} = req.params
        if (id, usecase){

            const check = await execShell.command(`${scriptsPath}/checkProvisionExists.sh`,[id,usecase], true)
            if (check){
                result = await execShell.command(`${scriptsPath}/getStatus.sh`,[id,usecase], false)
                return res.json(JSON.parse(result))
            } else {
                try {
                    return res.status(204).json({"info":"Provision not found"})
                } catch (e){
                    console.error(error)
                    res.status(500).json({"error":"Generic error"})
                }
            }
        } else {
            return res.status(400).json({"info":"Missing parameters"})
        }
    } catch (error) {
        return res.status(500).json(`error: ${error}`)
    }
  };

  const getUrls = async (req, res) => {
    try {
        const {id, usecase} = req.params
        if (id, usecase){

            const check = await execShell.command(`${scriptsPath}/checkProvisionExists.sh`,[id,usecase], true)
            if (check){
                result = await execShell.command(`${scriptsPath}/getUrls.sh`,[id,usecase], false)
                try{
                    return (res)?res.json(JSON.parse(result)):JSON.parse(result)
                } catch(error){
                    return res.status(500).json({error:error})
                }
            } else {
                try {
                    return res.status(404).json({"info":"Provision not found"})
                } catch (error){
                    console.error(error)
                    res.status(500).json({"error":"Generic error"})
                }
            }
        } else {
            return res.status(400).json({"info":"Missing parameters"})
        }
    } catch (error) {
        return res.status(500).json({error:error})
    }
  };

  const provision = async (req, res) => {
    try {
        const {id, usecase} = req.params
        let params = Object.keys(req.query).map(row=>{
            return `&-var&${row}=${req.query[row]}&`
        })
        let strParams = ''
        for (let i in params){
            strParams += params[i]
        }
        if (id, usecase){
            const check = await execShell.command(`${scriptsPath}/checkUsecaseExists.sh`,[usecase], true)
            if (check){
                await apis.put(`usecase/${id}`,{provision_started_at:new Date().toISOString()},"backend")
                await execShell.command(`${scriptsPath}/createProvisionFolder.sh`,[id,usecase], false)
                result = execShell.command(`${scriptsPath}/provision.sh`,[id,usecase,`"${strParams}"`], false).then(async res=>{
                  const urls = await getUrls({params:{id:id,usecase:usecase}})
                  await apis.put(`usecase/${id}`,{urls:urls,provision_finished_at:new Date().toISOString()},"backend")
                })
                return res.json({"info":"Provision requested"})
            } else {
                try {
                    return res.status(404).json({"info":"Use case not found"})
                } catch (e){
                    console.error(error)
                    res.status(500).json({"error":"Generic error"})
                }
            }
        } else {
            return res.status(400).json({"info":"Missing parameters"})
        }
    } catch (error) {
        return res.status(500).json(`error: ${error}`)
    }
  };

  const unprovision = async (req, res) => {
    try {
        const {id, usecase} = req.params
        let params = Object.keys(req.query).map(row=>{
            return `&-var&${row}=${req.query[row]}&`
        })
        let strParams = ''
        for (let i in params){
            strParams += params[i]
        }
        if (id, usecase){
            await apis.put(`usecase/${id}`,{unprovision_started_at:new Date().toISOString()},"backend")
            const check = await execShell.command(`${scriptsPath}/checkProvisionExists.sh`,[id,usecase], true)
            if (check){
                result = execShell.command(`${scriptsPath}/unprovision.sh`,[id,usecase,`"${strParams}"`], false).then(async res=>{
                    const urls = {}
                    await apis.put(`usecase/${id}`,{urls:urls,unprovision_finished_at:new Date().toISOString()},"backend")
                })
                return res.json({"info":"unprovision requested"})
            } else {
                try {
                    return res.status(404).json({"info":"Provision not found"})
                } catch (e){
                    console.error(error)
                    res.status(500).json({"error":"Generic error"})
                }
            }
        } else {
            return res.status(400).json({"info":"Missing parameters"})
        }
    } catch (error) {
        return res.status(500).json(`error: ${error}`)
    }
  };
  
  return {
    getStatus,
    getUrls,
    provision,
    unprovision
  };
};
