/*
*   ___                            
*  / _ \ _ __ __ _ _ __ ___   __ _ 
* | | | | '__/ _` | '_ ` _ \ / _` |
* | |_| | | | (_| | | | | | | (_| |
*  \___/|_|  \__,_|_| |_| |_|\__,_|
*                        Framework
*/

const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const processResponse = require('./process-response');
const MAIN_BUCKET = process.env.MAIN_BUCKET;
const IS_CORS = true;
const FILE_TYPE = ".json"

exports.handler = async event => {
  
  if (event.httpMethod === 'OPTIONS') {
    return processResponse(IS_CORS);
  }

  if (event.httpMethod != 'DELETE') {
    return processResponse(IS_CORS, `Error: You're using the wrong verb`, 400);
  }

  if (!event.queryStringParameters || typeof event.queryStringParameters.id == "undefined"){
    return processResponse(IS_CORS, `Error: You're missing the id parameter`, 400);  
  }

  const requestedItemId = parseInt(event.queryStringParameters.id);
  if (!requestedItemId) {
    return processResponse(IS_CORS, `Error: You're missing the id parameter`, 400);
  }

  try {
    const id = event.queryStringParameters.id
    const filename = `${id}${FILE_TYPE}`
    if (await checkObjectExists(MAIN_BUCKET, filename)){
      await removeObject(MAIN_BUCKET, filename)
      const result = {"result":`id ${id} was removed`}
      return processResponse(IS_CORS, result);
    } else {
      return processResponse(IS_CORS, {}, 404);
    }
  } catch (error) {
    let errorResponse = `Error: Execution delete, caused a error, please look at your logs.`;
    if (error.code === 'ValidationException') {
      if (error.message.includes('reserved keyword')) errorResponse = `Error: You're using AWS reserved keywords as attributes`;
    }
    console.log(error);
    return processResponse(IS_CORS, errorResponse, 500);
  }
};

function removeObject(bucket, key){
  return new Promise((resolve, reject) => {
    var params = {
      Bucket: bucket,
      Key: key
    };
    
    s3.deleteObject(params, function(err, data) {
      if (err) reject(err)
      else     resolve(data);          
    })
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