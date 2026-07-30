/*
* ___                            
* / _ \ _ __ __ _ _ __ ___   __ _ 
* | | | | '__/ _` | '_ ` _ \ / _` |
* | |_| | | | (_| | | | | | | (_| |
* \___/|_|  \__,_|_| |_| |_|\__,_|
* Framework - Object Storage (COS)
*/

function main(context) {
  let data = context.query || context.body || context.__ow_body || context || {};

  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    } catch (e) {
    }
  }

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'OPTIONS,GET,POST,PUT,DELETE',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Max-Age': '86400'
  };

  if (context.__ow_method && context.__ow_method.toLowerCase() === 'options') {
    return { statusCode: 200, headers: headers, body: JSON.stringify({ message: "OK" }) };
  }

  let bucket = data.bucket || data.bucketName || "orama-cos-bucket";
  let operation = data.operation || null;
  let objectKey = data.objectKey || data.objectName || data.key || null;
  let content = data.content || null;
  let errorResponse = [];

  if (operation) {
    const op = operation.toLowerCase();
    if (["put", "upload", "create", "write", "post"].includes(op)) operation = "put_object";
    else if (["get", "download", "read"].includes(op)) operation = objectKey ? "get_object" : "list_objects";
    else if (["delete", "remove"].includes(op)) operation = "delete_object";
    else if (["list"].includes(op)) operation = "list_objects";
  } else if (context.__ow_method) {
    // Inferir operação a partir do método HTTP
    const method = context.__ow_method.toLowerCase();
    if (method === 'post' || method === 'put') operation = "put_object";
    else if (method === 'get') operation = objectKey ? "get_object" : "list_objects";
    else if (method === 'delete') operation = "delete_object";
  }

  // Validation
  if (!bucket) {
    errorResponse.push("Error: parameter bucket is missing");
  }

  if (!operation) {
    errorResponse.push("Error: parameter operation is missing");
  } else {
    const validOperations = ["put_object", "get_object", "delete_object", "list_objects"];
    if (!validOperations.includes(operation)) {
      errorResponse.push(`Error: operation ${operation} is not permitted`);
    }
  }

  if ((operation === "get_object" || operation === "delete_object") && !objectKey) {
    errorResponse.push(`Error: parameter objectKey is required for ${operation}`);
  }

  if (operation === "put_object" && (!objectKey || !content)) {
    if (!objectKey) objectKey = `file_${Date.now()}.txt`;
    if (!content) content = JSON.stringify(data);
  }

  if (errorResponse.length) {
    return {
      statusCode: 400,
      headers: headers,
      body: JSON.stringify({ errors: errorResponse })
    };
  }

  try {
    let result = null;

    switch (operation) {
      case "put_object":
        result = {
          message: "Object uploaded successfully",
          bucket: bucket,
          objectKey: objectKey
        };
        break;

      case "get_object":
        result = {
          bucket: bucket,
          objectKey: objectKey,
          content: content || "Sample object content payload"
        };
        break;

      case "delete_object":
        result = {
          message: `Object ${objectKey} deleted successfully from bucket ${bucket}`,
          objectKey: objectKey
        };
        break;

      case "list_objects":
        result = {
          bucket: bucket,
          objects: []
        };
        break;

      default:
        break;
    }

    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify({ operation: operation, bucket: bucket, result: result })
    };

  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      headers: headers,
      body: JSON.stringify({ errors: `Error: ${error.message || error}` })
    };
  }
}

module.exports = main;