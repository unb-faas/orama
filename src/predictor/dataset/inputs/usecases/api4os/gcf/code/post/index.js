/*
*   ___                            
*  / _ \ _ __ __ _ _ __ ___   __ _ 
* | | | | '__/ _` | '_ ` _ \ / _` |
* | |_| | | | (_| | | | | | | (_| |
*  \___/|_|  \__,_|_| |_| |_|\__,_|
*                        Framework
*/

'use strict'

const {Storage} = require('@google-cloud/storage')
const fs = require('fs')
const FILE_TYPE = '.json'
const bucket = process.env.MAIN_BUCKET

exports.set = async (req, res) => {
  let value = null
  try{
    value = JSON.parse(req.body)
  } catch(e){
    res.status(500).send({error:"content is not in a json format"})
  }

  try {
    let id = getID()
    let filename = `${id}${FILE_TYPE}`
    while (await checkIfFileExistsOnCloudStorage(bucket,filename)){
      lid = getID()
      filename = `${id}${FILE_TYPE}`    
    }
    const resultFileCreation = createLocalFile(id,value)
    if (resultFileCreation.result){
      const result = await copyFileToCloudStorage(bucket, resultFileCreation.filepath, filename)
      if (result){
        res.status(200).send({result:`File created with id ${id}`})
      } else {
        res.status(500).send({result:`Failed to send file to cloud storage: ${result}`})
      }
    } else {
      res.status(500).send({result:"Failed to create file on tmp ",error:resultFileCreation.error})
    }
  } catch (err) {
    console.error(new Error(err.message))
    res.status(500).send(err.message)
  }

  function getID(){
    const hrTime = process.hrtime()
    const microTime = hrTime[0] * 1000000 + hrTime[1] / 1000
    return parseInt(microTime)
  }

  function checkIfFileExistsOnCloudStorage(bucket,filename){
    return new Promise(async(resolve, reject) => {
      try {
        await getFileFromCloudStorage(bucket,file)
        resolve(true)
      } catch (e){
        resolve(false)
      }
    })
  }

  function copyFileToCloudStorage(bucketName, filePath, destFileName) {
    return new Promise((resolve, reject) => {
      const storage = new Storage()
      async function uploadFile() {
        return await storage.bucket(bucketName).upload(filePath, {
          destination: destFileName,
        })
      }
      uploadFile().catch(e=>reject(e)).then(res=>{resolve(res)})
    })
  }

  function createLocalFile(filename, content){
    try{
      const filepath = `/tmp/${filename}${FILE_TYPE}`
      fs.writeFileSync(filepath, JSON.stringify(content))
      return {result:true,filepath:filepath}
    } catch(e){
      return {result:false,error:e}
    }
  }

  function readLocalFile(filepath){
    try{
      const content = fs.readFileSync(filepath, 'utf8')
      return {result:true,content:JSON.parse(content)}
    } catch(e){
      return {result:false,error:e}
    }
  }

  function getFileFromCloudStorage(bucketName,fileName) {
    const destFileName = `/tmp/${fileName}`
    return new Promise((resolve, reject) => { 
      const storage = new Storage()
      async function downloadFile() {
        const options = {
          destination: destFileName,
        }
        await storage.bucket(bucketName).file(fileName).download(options)
      }
      downloadFile().catch(e=>reject(e)).then(res=>{
        const localFileRead = readLocalFile(destFileName)
        if (localFileRead.result){
          resolve(localFileRead.content)
        } else{
          reject({error:"cant't read tmp downloaded file from cloud storage"})
        }
      })
    })
   }
}