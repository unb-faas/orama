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
const FILE_TYPE = ".json"
const BUCKET_NAME = process.env.MAIN_BUCKET
const ALICLOUD_ACCESS_KEY = process.env.ALICLOUD_ACCESS_KEY
const ALICLOUD_SECRET_KEY = process.env.ALICLOUD_SECRET_KEY
const REGION = process.env.REGION
const MAX_TENTATIVAS = 1000

exports.post = async (request, response, context) => {
  response.setHeader('Content-Type', 'application/json')
  let content = request.body
  try {
    JSON.parse(content)
  } catch (e) {
    response.setStatusCode(500)
    response.send(`{ "error": "content is not in a json format" }`)
    return
  }

  try {
    let id = getID()
    let filename = `${id}${FILE_TYPE}`
    var count = 0;
    while (await checkIfFileExistsOnCloudStorage(filename) && count < MAX_TENTATIVAS) {
      id = getID()
      filename = `${id}${FILE_TYPE}`
    }
    if (count == MAX_TENTATIVAS) {
      response.setStatusCode(500)
      response.send(`{ "error": "Limit of ${count} attempts to create a new object in storage has been exceeded" }`)
      return
    }

    const resultFileCreation = createLocalFile(filename, content)
    if (resultFileCreation.result) {
      const result = await copyFileToCloudStorage(filename, resultFileCreation.filepath)
      if (result) {
        response.setStatusCode(200)
        response.send(`{ "result": "File created with id ${filename}" }`)
      } else {
        response.setStatusCode(500)
        response.send(`{ "result": "Failed to send file to cloud storage: ${result}" }`)
      }
    } else {
      response.setStatusCode(500)
      response.send(`{ "result": "Failed to create file on tmp", error: ${resultFileCreation.error} }`)
    }
  } catch (err) {
    console.error(new Error(err.message))
    response.setStatusCode(500)
    response.send(`{ "error": "${err.message}" }`)
  }

  function getID() {
    const hrTime = process.hrtime()
    const microTime = hrTime[0] * 1000000 + hrTime[1] / 1000
    return parseInt(microTime)
  }

  function checkIfFileExistsOnCloudStorage(filename) {
    return new Promise(async (resolve, reject) => {
      try {
        await getFileFromCloudStorage(filename)
        resolve(true)
      } catch (e) {
        resolve(false)
      }
    })
  }

  function copyFileToCloudStorage(fileName, filePath) {
    return new Promise((resolve, reject) => {
      const storage = new OSS({
        accessKeyId: ALICLOUD_ACCESS_KEY,
        accessKeySecret: ALICLOUD_SECRET_KEY,
        bucket: BUCKET_NAME,
        region: "oss-" + REGION + "-internal",
        dir: "/",
      })
      async function uploadFile() {
        return await storage.put(fileName, filePath)
      }
      uploadFile()
        .catch(e => {
          console.error(e.message)
          reject(e)
         })
        .then(res => resolve(res) )
    })
  }

  function createLocalFile(filename, content) {
    try {
      const filepath = `/tmp/${filename}`
      fs.writeFileSync(filepath, content)
      return { result: true, filepath: filepath }
    } catch (e) {
      return { result: false, error: e }
    }
  }

  function readLocalFile(filepath) {
    try {
      const content = fs.readFileSync(filepath, 'utf8')
      return { result: true, content: content }
    } catch (e) {
      return { result: false, error: e }
    }
  }

  function getFileFromCloudStorage(fileName) {
    const destFileName = `/tmp/${fileName}`
    return new Promise((resolve, reject) => {
      const storage = new OSS({
        accessKeyId: ALICLOUD_ACCESS_KEY,
        accessKeySecret: ALICLOUD_SECRET_KEY,
        bucket: BUCKET_NAME,
        region: "oss-" + REGION + "-internal",
        dir: "/",
      })
      async function downloadFile() {
        await storage.get(fileName, destFileName)
      }
      downloadFile().catch(e => reject(e)).then(res => {
        const localFileRead = readLocalFile(destFileName)
        if (localFileRead.result) {
          resolve(localFileRead.content)
        } else {
          reject({ error: "cant't read tmp downloaded file from cloud storage" })
        }
      })
    })
  }
}
