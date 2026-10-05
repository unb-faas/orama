/*
*   ___
*  / _ \ _ __ __ _ _ __ ___   __ _
* | | | | '__/ _` | '_ ` _ \ / _` |
* | |_| | | | (_| | | | | | | (_| |
*  \___/|_|  \__,_|_| |_| |_|\__,_|
*                        Framework
*/

// FaaS based on https://github.com/simalexan/api-lambda-save-dynamodb
// Thanks to Aleksandar Simovic
// Adapted by Leonardo Reboucas de Carvalho
// Updated to AWS SDK for JavaScript v3

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
  DynamoDBDocumentClient,
  PutCommand
} = require('@aws-sdk/lib-dynamodb');

const processResponse = require('./process-response.js');

const TABLE_NAME = process.env.TABLE_NAME;
const PK = process.env.PK;
const IS_CORS = true;

// AWS SDK v3
const dynamoDbClient = new DynamoDBClient({});
const dynamoDb = DynamoDBDocumentClient.from(dynamoDbClient);

exports.handler = async event => {

  // Handle CORS preflight request
  if (event.httpMethod === 'OPTIONS') {
    return processResponse(IS_CORS);
  }

  // Validate request body
  if (!event.body) {
    return processResponse(IS_CORS, 'invalid', 400);
  }

  let item;

  try {
    item = JSON.parse(event.body);
  } catch (error) {
    console.error('Invalid JSON:', error);
    return processResponse(IS_CORS, 'invalid JSON', 400);
  }

  // Generate primary key
  item[PK] = getID();

  const params = {
    TableName: TABLE_NAME,
    Item: item
  };

  try {

    await dynamoDb.send(new PutCommand(params));

    return processResponse(IS_CORS);

  } catch (error) {

    let errorResponse =
      'Error: Execution save, caused by a DynamoDB error, please look at your logs.';

    if (error.name === 'ValidationException') {
      if (
        error.message &&
        error.message.includes('reserved keyword')
      ) {
        errorResponse =
          "Error: You're using AWS reserved keywords as attributes";
      }
    }

    console.error('DynamoDB error:', error);

    return processResponse(IS_CORS, errorResponse, 500);
  }
};

function getID() {
  const hrTime = process.hrtime();
  const microTime =
    hrTime[0] * 1000000 + hrTime[1] / 1000;

  return parseInt(microTime);
}