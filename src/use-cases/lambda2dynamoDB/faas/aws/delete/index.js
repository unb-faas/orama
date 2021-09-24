// FaaS based on https://github.com/simalexan/api-lambda-delete-dynamodb
// Thanks to Aleksandar Simovic
// Adapted by Leonardo Reboucas de Carvalho

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const processResponse = require('./process-response');
const TABLE_NAME = process.env.TABLE_NAME;
const PK = process.env.PK;
const IS_CORS = true;

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

  const keyN = {};
  keyN[PK] = requestedItemId;
  const params = {
    TableName: TABLE_NAME,
    Key: keyN
  }
  try {
    const result = await dynamoDb.delete(params).promise();
    return processResponse(IS_CORS, result);
  } catch (dbError) {
    let errorResponse = `Error: Execution delete, caused a Dynamodb error, please look at your logs.`;
    if (dbError.code === 'ValidationException') {
      if (dbError.message.includes('reserved keyword')) errorResponse = `Error: You're using AWS reserved keywords as attributes`;
    }
    console.log(dbError);
    return processResponse(IS_CORS, errorResponse, 500);
  }
};
