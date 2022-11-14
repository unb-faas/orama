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


exports.get = async (request, response, context) => {
  try {
    const id = request.queries ? request.queries['id'] : null
    if (id) {
      const file = await getFileFromCloudStorage(`${id}`)
      response.setStatusCode(200)
      response.send(file)
    } else {
      const list = compactFilesList(await listCloudStorageFiles())
      response.setStatusCode(200)
      response.send(JSON.stringify(list))
    }
  } catch (err) {
    console.error(new Error(err.message))
    response.setStatusCode(500)
    response.send(err.message)
  }

  function listCloudStorageFiles() {
    return new Promise((resolve, reject) => {
      const storage = new OSS({
        accessKeyId: ALICLOUD_ACCESS_KEY,
        accessKeySecret: ALICLOUD_SECRET_KEY,
        bucket: BUCKET_NAME,
        region: "oss-" + REGION + "-internal",
        dir: "/",
      })
      async function listFiles() {
        var storageResp = await storage.list()
        return storageResp ? storageResp.objects : null
      }
      listFiles().catch(e => reject(e)).then(res => resolve(res))
    })
  }

  function compactFilesList(list) {
    return list.map(row => row.name)
  }

  function readLocalFile(filepath) {
    try {
      const content = fs.readFileSync(filepath, 'utf8')
      //content = JSON.parse(content)
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