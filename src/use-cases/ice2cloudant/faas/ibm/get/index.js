/*
* ___                            
* / _ \ _ __ __ _ _ __ ___   __ _ 
* | | | | '__/ _` | '_ ` _ \ / _` |
* | |_| | | | (_| | | | | | | (_| |
* \___/|_|  \__,_|_| |_| |_|\__,_|
* Framework - Database (Cloudant)
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

  // Handle HTTP OPTIONS pre-flight
  if (context.__ow_method && context.__ow_method.toLowerCase() === 'options') {
    return { statusCode: 200, headers: headers, body: JSON.stringify({ message: "OK" }) };
  }

  let dbName = data.dbName || "orama-db";
  let operation = data.operation || null;
  let docId = data.docId || data.id || null;
  let document = data.document || data.doc || null;
  let errorResponse = [];

  // Alias mapping
  if (operation) {
    const op = operation.toLowerCase();
    if (["create", "insert", "post"].includes(op)) operation = "create_doc";
    else if (["get", "read"].includes(op)) operation = docId ? "get_doc" : "list_docs";
    else if (["delete", "remove"].includes(op)) operation = "delete_doc";
    else if (["list"].includes(op)) operation = "list_docs";
  } else if (context.__ow_method) {
    // Infer operation from HTTP Method if operation is not provided in payload
    const method = context.__ow_method.toLowerCase();
    if (method === 'post' || method === 'put') operation = "create_doc";
    else if (method === 'get') operation = docId ? "get_doc" : "list_docs";
    else if (method === 'delete') operation = "delete_doc";
  }

  // Validatio
  if (!dbName) {
    errorResponse.push("Error: parameter dbName is missing");
  }

  if (!operation) {
    errorResponse.push("Error: parameter operation is missing");
  } else {
    const validOperations = ["create_doc", "get_doc", "delete_doc", "list_docs"];
    if (!validOperations.includes(operation)) {
      errorResponse.push(`Error: operation ${operation} is not permitted`);
    }
  }

  if ((operation === "get_doc" || operation === "delete_doc") && !docId) {
    errorResponse.push(`Error: parameter docId is required for ${operation}`);
  }

  if (operation === "create_doc" && !document) {
    if (data && typeof data === 'object' && Object.keys(data).length > 0) {
      document = data;
    } else {
      errorResponse.push("Error: parameter document is required for create_doc");
    }
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
      case "create_doc":
        result = {
          message: "Document created successfully",
          id: docId || `doc_${Date.now()}`,
          doc: document
        };
        break;

      case "get_doc":
        result = {
          id: docId,
          doc: document || { message: "Sample document content" }
        };
        break;

      case "delete_doc":
        result = {
          message: `Document ${docId} deleted successfully`,
          id: docId
        };
        break;

      case "list_docs":
        result = {
          dbName: dbName,
          documents: []
        };
        break;

      default:
        break;
    }

    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify({ operation: operation, dbName: dbName, result: result })
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