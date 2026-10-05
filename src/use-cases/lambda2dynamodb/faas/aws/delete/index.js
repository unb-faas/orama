/*
*   ___                            
*  / _ \ _ __ __ _ _ __ ___   __ _ 
* | | | | '__/ _` | '_ ` _ \ / _` |
* | |_| | | | (_| | | | | | | (_| |
*  \___/|_|  \__,_|_| |_| |_|\__,_|
*                        Framework
*/

// FaaS based on https://github.com/simalexan/api-lambda-delete-dynamodb
// Thanks to Aleksandar Simovic
// Adapted by Leonardo Reboucas de Carvalho

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
  DynamoDBDocumentClient,
  DeleteCommand
} = require('@aws-sdk/lib-dynamodb');

const processResponse = require('./process-response');

const TABLE_NAME = process.env.TABLE_NAME;
const PK = process.env.PK;
const IS_CORS = true;

const dynamoDbClient = new DynamoDBClient({});
const dynamoDb = DynamoDBDocumentClient.from(dynamoDbClient);

exports.handler = async event => {

  if (event.httpMethod === 'OPTIONS') {
    return processResponse(IS_CORS);
  }

  if (event.httpMethod !== 'DELETE') {
    return processResponse(IS_CORS, `Error: You're using the wrong verb`, 400);
  }

  if (
    !event.queryStringParameters ||
    typeof event.queryStringParameters.id === 'undefined'
  ) {
    return processResponse(IS_CORS, `Error: You're missing the id parameter`, 400);
  }

  const requestedItemId = parseInt(
    event.queryStringParameters.id,
    10
  );

  if (!requestedItemId) {
    return processResponse(IS_CORS, `Error: You're missing the id parameter`, 400);
  }

  const keyN = {};
  keyN[PK] = requestedItemId;

  const params = {
    TableName: TABLE_NAME,
    Key: keyN
  };

  try {
    const result = await dynamoDb.send(
      new DeleteCommand(params)
    );

    return processResponse(IS_CORS, result);

  } catch (dbError) {

    let errorResponse =
      `Error: Execution delete, caused a DynamoDB error, please look at your logs.`;

    if (dbError.name === 'ValidationException') {
      if (
        dbError.message &&
        dbError.message.includes('reserved keyword')
      ) {
        errorResponse =
          `Error: You're using AWS reserved keywords as attributes`;
      }
    }

    console.error(dbError);

    return processResponse(
      IS_CORS,
      errorResponse,
      500
    );
  }
};