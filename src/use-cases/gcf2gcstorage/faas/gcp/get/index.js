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

exports.get = async (req, res) => {
  try {
    const id = (req.query.id) ? (req.query.id) : null 
    if (id){
      const file = await getFileFromCloudStorage(bucket,`${id}${FILE_TYPE}`)
      res.status(200).send(file)
    } else {
      const list = compactFilesList(await listCloudStorageFiles(bucket))
      res.status(200).send(list)
    }
  } catch (err) {
    console.error(new Error(err.message))
    res.status(500).send(err.message)
  }

  function listCloudStorageFiles(bucketName) {
    return new Promise((resolve, reject) => { 
      const storage = new Storage()
      async function listFiles() {
        const [files] = await storage.bucket(bucketName).getFiles()
        return files
      }
      listFiles().catch(e=>reject(e)).then(res=>resolve(res))
    })
  }

  function compactFilesList(list){
    return list.map(row => parseInt(row.name.replace(FILE_TYPE,""),10))
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