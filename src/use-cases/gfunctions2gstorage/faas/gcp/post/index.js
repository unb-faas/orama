/*
*   ___                            
*  / _ \ _ __ __ _ _ __ ___   __ _ 
* | | | | '__/ _` | '_ ` _ \ / _` |
* | |_| | | | (_| | | | | | | (_| |
*  \___/|_|  \__,_|_| |_| |_|\__,_|
*                        Framework
*/


'use strict';

const FILE_TYPE = '.json'
const bucket = process.env.MAIN_BUCKET

exports.set = async (req, res) => {
  let value = null
  try{
    value = JSON.parse(req.body)
  } catch(e){
    res.status(500).send({error:"content is not in a json format"});
  }

  try {
    const id = getID()
    const resultFileCreation = createLocalFile(id,value)
    if (resultFileCreation.result){
      const result = await copyFileToCloudStorage(bucket, resultFileCreation.filepath, `${id}${FILE_TYPE}`)
      if (result){

        let file_created = null
        let file_not_created = null
        file_created = await getFileFromCloudStorage(bucket,`${id}${FILE_TYPE}`)
        try{
        file_not_created = await getFileFromCloudStorage(bucket,`inexistent.json`)
        }catch(e){file_not_created = e}
        res.status(200).send({result:`File created with id ${id}`,file_created:file_created,file_not_created:file_not_created});
      } else {
        res.status(500).send({result:`Failed to send file to cloud storage: ${result}`});
      }
    } else {
      res.status(500).send({result:"Failed to create file on tmp ",error:resultFileCreation.error});
    }
  } catch (err) {
    console.error(new Error(err.message)); // Add to Stackdriver Error Reporting
    res.status(500).send(err.message);
  }

  function getID(){
    const hrTime = process.hrtime()
    const microTime = hrTime[0] * 1000000 + hrTime[1] / 1000
    return parseInt(microTime)
  }

  // function listFiles(bucketName) {
  //   const {Storage} = require('@google-cloud/storage');
  //   const storage = new Storage();
  //   async function listFiles() {
  //     const [files] = await storage.bucket(bucketName).getFiles();
  //     files.forEach(file => {
  //       console.log(file.name);
  //     });
  //   }
  
  //   listFiles().catch(console.error);
  //   // [END storage_list_files]
  // }

  function copyFileToCloudStorage(bucketName, filePath, destFileName) {
    return new Promise((resolve, reject) => {
      const {Storage} = require('@google-cloud/storage');
      const storage = new Storage();
      async function uploadFile() {
        return await storage.bucket(bucketName).upload(filePath, {
          destination: destFileName,
        });
      }
      uploadFile().catch(e=>reject(e)).then(res=>{resolve(res)})
    })
  }

  function createLocalFile(filename, content){
    const fs = require('fs');
    try{
      const filepath = `/tmp/${filename}${FILE_TYPE}`
      fs.writeFileSync(filepath, JSON.stringify(content))
      return {result:true,filepath:filepath}
    } catch(e){
      return {result:false,error:e}
    }
  }

  function readLocalFile(filepath){
    const fs = require('fs');
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
      const {Storage} = require('@google-cloud/storage');
      const storage = new Storage();
      async function downloadFile() {
        const options = {
          destination: destFileName,
        };
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






};