/*
* ___                            
* / _ \ _ __ __ _ _ __ ___   __ _ 
* | | | | '__/ _` | '_ ` _ \ / _` |
* | |_| | | | (_| | | | | | | (_| |
* \___/|_|  \__,_|_| |_| |_|\__,_|
* Framework
*/

module.exports = async (context) => {
  const data = context.query || context.body || {};

  let a = data.a !== undefined ? data.a : null;
  let b = data.b !== undefined ? data.b : null;
  let operation = data.operation !== undefined ? data.operation : null;
  let errorResponse = [];

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'OPTIONS,GET,POST',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Max-Age': '86400'
  };

  if (a == null) {
    errorResponse.push("Error: parameter a is missing");
  }

  if (b == null) {
    errorResponse.push("Error: parameter b is missing");
  }

  if (operation == null) {
    errorResponse.push("Error: parameter operation is missing");
  } else {
    if (operation !== "addition" && operation !== "subtraction" && operation !== "multiplication" && operation !== "division") {
      errorResponse.push(`Error: operation ${operation} is not permited`);
    }
  }

  if (errorResponse.length) {
    return {
      statusCode: 500, 
      headers: headers,
      body: JSON.stringify({ errors: errorResponse })
    };
  }

  try {
    let result = null;
    switch (operation) {
      case "addition":
        result = parseFloat(a) + parseFloat(b);
        break;

      case "subtraction":
        result = parseFloat(a) - parseFloat(b);
        break;

      case "multiplication":
        result = parseFloat(a) * parseFloat(b);
        break;

      case "division":
        result = (parseFloat(b) !== 0) ? parseFloat(a) / parseFloat(b) : 0;
        break;

      default:
        break;
    }

    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify({ operation: operation, a: a, b: b, result: result })
    };

  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      headers: headers,
      body: JSON.stringify({ errors: `Error: ${error.message || error}` })
    };
  }
};