/*
*   ___
*  / _ \ _ __ __ _ _ __ ___   __ _
* | | | | '__/ _` | '_ ` _ \ / _` |
* | |_| | | | (_| | | | | | | (_| |
*  \___/|_|  \__,_|_| |_| |_|\__,_|
*                        Framework
*/

// FaaS based on https://github.com/simalexan/api-lambda-get-all-dynamodb
// Thanks to Aleksandar Simovic
// Adapted by Leonardo Reboucas de Carvalho
// Updated to AWS SDK for JavaScript v3

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
  DynamoDBDocumentClient,
  ScanCommand
} = require('@aws-sdk/lib-dynamodb');

const processResponse = require('./process-response');

const TABLE_NAME = process.env.TABLE_NAME;
const IS_CORS = true;

// AWS SDK v3
const dynamoDbClient = new DynamoDBClient({});
const dynamoDb = DynamoDBDocumentClient.from(dynamoDbClient);

/**
 * Retrieves a segment from DynamoDB
 *
 * @param {Object} event Lambda event
 * @returns {Object} HTTP response
 */
exports.handler = async event => {

  // Handle CORS preflight request
  if (event.httpMethod === 'OPTIONS') {
    return processResponse(IS_CORS);
  }

  const queryStringParameters = event.queryStringParameters || {};

  const segment = Number(queryStringParameters.segment || 0);
  const totalSegments = Number(queryStringParameters.totalSegment || 1);

  const params = {
    TableName: TABLE_NAME,
    Segment: segment,
    TotalSegments: totalSegments
  };

  try {

    const response = await dynamoDb.send(
      new ScanCommand(params)
    );

    return processResponse(IS_CORS, response.Items);

  } catch (dbError) {

    let errorResponse =
      'Error: Execution get, caused by a DynamoDB error, please look at your logs.';

    if (dbError.name === 'ValidationException') {
      if (
        dbError.message &&
        dbError.message.includes('reserved keyword')
      ) {
        errorResponse =
          "Error: You're using AWS reserved keywords as attributes";
      }
    }

    console.error('DynamoDB error:', dbError);

    return processResponse(IS_CORS, errorResponse, 500);
  }
};