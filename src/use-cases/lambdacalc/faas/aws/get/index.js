const processResponse = require('./process-response.js');
const IS_CORS = true;

exports.handler = async event => {
  let a = (event.queryStringParameters) ? event.queryStringParameters.a : null
  let b = (event.queryStringParameters) ? event.queryStringParameters.b : null
  let operation = (event.queryStringParameters) ? event.queryStringParameters.operation : null
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
    return processResponse(IS_CORS, {errors:errorResponse}, 500);
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
    return processResponse(true, {operation:operation,a:a,b:b,result:result});
  } catch (error) {
    let errorResponse = `Error: ${error}`
    console.log(error);
    return processResponse(IS_CORS, errorResponse, 500);
  }
};