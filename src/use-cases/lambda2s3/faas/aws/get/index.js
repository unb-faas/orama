/*
*   ___                            
*  / _ \ _ __ __ _ _ __ ___   __ _ 
* | | | | '__/ _` | '_ ` _ \ / _` |
* | |_| | | | (_| | | | | | | (_| |
*  \___/|_|  \__,_|_| |_| |_|\__,_|
*                        Framework
*/

const AWS = require('aws-sdk');
const processResponse = require('./process-response');
const MAIN_BUCKET = process.env.MAIN_BUCKET;
const IS_CORS = true;
const s3 = new AWS.S3();
const FILE_TYPE = ".json"

exports.handler = async event => {
  if (event.httpMethod === 'OPTIONS') {
    return processResponse(IS_CORS);
  }
  try {
    let id = (event.queryStringParameters) ? event.queryStringParameters.id : null
    if (id){
      const file = await getObject(MAIN_BUCKET,`${id}${FILE_TYPE}`)
      const json = JSON.parse(file)
      return processResponse(true, json)
    } else {
      const files = await listFiles(MAIN_BUCKET)
      let list = []
      if (files && files.Contents){
        list = compactList(files.Contents)
      }
      return processResponse(true, list)
    }
  } catch (error) {
    let errorResponse = `Error: Execution get caused a error check id passed.`;
    if (error.code === 'ValidationException') {
      if (error.message.includes('reserved keyword')) errorResponse = `Error: You're using AWS reserved keywords as attributes`;
    }
    console.log(error);
    return processResponse(IS_CORS, errorResponse, 500);
  }
};

function listFiles(bucket){
  return new Promise((resolve, reject) => {
    var params = { 
      Bucket: bucket,
      Delimiter: '',
    }
    s3.listObjects(params, function (err, data) {
      if(err)throw err;
      resolve(data);
    });
  })
}

function compactList(list){
  const reduced = list.map(row => {
    return parseInt(row.Key.replace(`${FILE_TYPE}`,""),10)
  })
  return reduced
}

async function getObject (bucket, objectKey) {
  try {
    const params = {
      Bucket: bucket,
      Key: objectKey 
    }
    const data = await s3.getObject(params).promise();
    return data.Body.toString('utf-8');
  } catch (e) {
    throw new Error(`Could not retrieve file from S3: ${e.message}`)
  }
}
