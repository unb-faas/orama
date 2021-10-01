/*
*   ___                            
*  / _ \ _ __ __ _ _ __ ___   __ _ 
* | | | | '__/ _` | '_ ` _ \ / _` |
* | |_| | | | (_| | | | | | | (_| |
*  \___/|_|  \__,_|_| |_| |_|\__,_|
*                        Framework
*/

const AWS = require('aws-sdk');
const processResponse = require('./process-response.js');
const MAIN_BUCKET = process.env.MAIN_BUCKET;
const IS_CORS = true;
const FILE_TYPE = ".json"
exports.handler = async event => {
  if (event.httpMethod === 'OPTIONS') {
    return processResponse(IS_CORS);
  }
  if (!event.body) {
    return processResponse(IS_CORS, 'invalid', 400);
  }
  try {
    const item = JSON.parse(event.body);
    let id = getID()
    let filename = `${id}${FILE_TYPE}`
    while (await checkObjectExists(MAIN_BUCKET,filename)){
      id = getID()
      filename = `${id}${FILE_TYPE}`
    }
    await putObjectToS3(MAIN_BUCKET,`${filename}`,JSON.stringify(item))
    return processResponse(IS_CORS, {id:id});
  } catch (error) {
    let errorResponse = `Error: Execution save, caused a error, please look at your logs.`;
    if (error.code === 'ValidationException') {
      if (error.message.includes('reserved keyword')) errorResponse = `Error: You're using AWS reserved keywords as attributes`;
    }
    console.log(error);
    return processResponse(IS_CORS, errorResponse, 500);
  }
};

function putObjectToS3(bucket, key, data){
  const s3 = new AWS.S3();
  return new Promise((resolve, reject) => {
    const params = {
      Bucket : bucket,
      Key : key,
      Body : data
    }
    s3.putObject(params, function(err, data) {
      if (err) reject(err, err.stack); // an error occurred
      else     resolve(data);           // successful response
    });
  })
}

async function checkObjectExists(bucket, objectKey) {
  try {
    const params = {
      Bucket: bucket,
      Key: objectKey 
    }
    const data = await s3.getObject(params).promise();
    if (data){
      return true
    } else {
      return false
    }
  } catch (e) {
    return false
  }
}

function getID(){
  const hrTime = process.hrtime()
  const microTime = hrTime[0] * 1000000 + hrTime[1] / 1000
  return parseInt(microTime)
}