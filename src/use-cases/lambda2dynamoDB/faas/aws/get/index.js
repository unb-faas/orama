// FaaS based on https://github.com/simalexan/api-lambda-get-all-dynamodb
// Thanks to Aleksandar Simovic
// Adapted by Leonardo Reboucas de Carvalho

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const processResponse = require('./process-response');
const TABLE_NAME = process.env.TABLE_NAME;
const IS_CORS = true;
const LIMIT = process.env.LIMIT;

exports.handler = async event => {
  if (event.httpMethod === 'OPTIONS') {
    return processResponse(IS_CORS);
  }
  let params = {
    TableName: TABLE_NAME,
    Segment: getSegment(),
    TotalSegments: LIMIT,
  }
  try {
    const response = await dynamoDb.scan(params).promise();
    return processResponse(true, response.Items);
  } catch (dbError) {
    let errorResponse = `Error: Execution get, caused a Dynamodb error, please look at your logs.`;
    if (dbError.code === 'ValidationException') {
      if (dbError.message.includes('reserved keyword')) errorResponse = `Error: You're using AWS reserved keywords as attributes`;
    }
    console.log(dbError);
    return processResponse(IS_CORS, errorResponse, 500);
  }
};

function getSegment(){
    return 100
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }