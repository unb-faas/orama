/*
*   ___                            
*  / _ \ _ __ __ _ _ __ ___   __ _ 
* | | | | '__/ _` | '_ ` _ \ / _` |
* | |_| | | | (_| | | | | | | (_| |
*  \___/|_|  \__,_|_| |_| |_|\__,_|
*                        Framework
*/

const processResponse = require('./process-response.js');
const IS_CORS = true;

exports.handler = (event, context, callback) => {
  event = JSON.parse(event);
  console.log(JSON.stringify(event));
  let a = (event.queryParameters) ? event.queryParameters.a : null
  let b = (event.queryParameters) ? event.queryParameters.b : null
  let operation = (event.queryParameters) ? event.queryParameters.operation : null
  let errorResponse = []
  if (a == null){
    errorResponse.push("Error: parameter a is missing")
  }

  if (b == null){
    errorResponse.push("Error: parameter b is missing")
  }

  if (operation == null){
    errorResponse.push("Error: parameter operation is missing")
  } else {
    if (operation !== "addition" && operation !== "subtraction" && operation !== "multiplication" && operation !== "division"){
      errorResponse.push(`Error: operation ${operation} is not permited`)
    }
  }

  if (errorResponse.length){
    callback(null, processResponse(IS_CORS, {errors:errorResponse}, 500));
  }

  try {
    let result = null
    switch (operation) {
      case "addition":
        result = parseFloat(a) + parseFloat(b)
        break;
      
      case "subtraction":
        result = parseFloat(a) - parseFloat(b)
        break;
      
      case "multiplication":
        result = parseFloat(a) * parseFloat(b)
        break;
      
      case "division":
        result = (parseFloat(b)!==0) ? parseFloat(a) / parseFloat(b) : 0
        break;

      default:
        break;
    }
    callback(null, processResponse(true, {operation:operation,a:a,b:b,result:result}));
  } catch (error) {
    let errorResponse = `Error: ${error}`
    console.log(error);
    callback(null, processResponse(IS_CORS, errorResponse, 500));
  }
};