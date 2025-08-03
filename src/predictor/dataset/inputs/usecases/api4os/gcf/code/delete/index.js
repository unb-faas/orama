/*
*   ___                            
*  / _ \ _ __ __ _ _ __ ___   __ _ 
* | | | | '__/ _` | '_ ` _ \ / _` |
* | |_| | | | (_| | | | | | | (_| |
*  \___/|_|  \__,_|_| |_| |_|\__,_|
*                        Framework
*/

'use strict'

const FILE_TYPE = '.json'
const bucket = process.env.MAIN_BUCKET
const {Storage} = require('@google-cloud/storage')

exports.del = async (req, res) => {
  try {
    const id = (req.query.id) ? (req.query.id) : null 
    if (id){
      const fileDeletationResult = await deleteFileFromCloudStorage(bucket,`${id}${FILE_TYPE}`)
      if (fileDeletationResult.result){
        res.status(200).send({result:`id ${id} was removed`})
      } else {
        res.status(500).send(fileDeletationResult.message)
      }
    } else {
      res.status(400).send({error:"missing id on your request"})
    }
  } catch (err) {
    console.error(new Error(err.message))
    res.status(500).send(err.message)
  }
  
  function deleteFileFromCloudStorage(bucketName, fileName) {
    return new Promise((resolve, reject) => { 
      const storage = new Storage()
      async function deleteFile() {
        const result = await storage.bucket(bucketName).file(fileName).delete()
        return result
      }
      deleteFile().catch(e=>reject({result:false,message:e}))
                  .then(res=>resolve({result:true,message:res}))
    })
  }

}