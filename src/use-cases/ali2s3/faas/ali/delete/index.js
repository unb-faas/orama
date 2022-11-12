/*
*   ___                            
*  / _ \ _ __ __ _ _ __ ___   __ _ 
* | | | | '__/ _` | '_ ` _ \ / _` |
* | |_| | | | (_| | | | | | | (_| |
*  \___/|_|  \__,_|_| |_| |_|\__,_|
*                        Framework
*/

'use strict'

const OSS = require('ali-oss')
const fs = require('fs')
const BUCKET_NAME = process.env.MAIN_BUCKET
const ALICLOUD_ACCESS_KEY = process.env.ALICLOUD_ACCESS_KEY
const ALICLOUD_SECRET_KEY = process.env.ALICLOUD_SECRET_KEY
const REGION = process.env.REGION
const MAX_TENTATIVAS = 1000

exports.delete = async (request, response, context) => {
  try {
    const id = request.queries ? request.queries['id'] : null
    if (id){
      const fileDeletationResult = await deleteFileFromCloudStorage(id)
      if (fileDeletationResult.result){
        response.setStatusCode(200)
        response.setHeader('Content-Type', 'application/json')
        response.send(`{"result":"id ${id} was removed"}`)
      } else {
        response.setStatusCode(500)
        response.send(fileDeletationResult.message)
      }
    } else {
      response.setStatusCode(400)
      response.send(`{"error":"missing id on your request"}`)
    }
  } catch (err) {
    console.error(new Error(err.message))
    response.setStatusCode(500)
    response.send(err.message)
  }
  
  function deleteFileFromCloudStorage(fileName) {
    return new Promise((resolve, reject) => { 
      const storage = new OSS({
        accessKeyId: ALICLOUD_ACCESS_KEY,
        accessKeySecret: ALICLOUD_SECRET_KEY,
        bucket: BUCKET_NAME,
        region: "oss-" + REGION + "-internal",
        dir: "/",
      })
      async function deleteFile() {
        return await storage.delete(fileName)
      }
      deleteFile().catch(e=>reject({result:false,message:e}))
                  .then(response=>resolve({result:true,message:response}))
    })
  }

}