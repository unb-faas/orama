/*
*   ___                            
*  / _ \ _ __ __ _ _ __ ___   __ _ 
* | | | | '__/ _` | '_ ` _ \ / _` |
* | |_| | | | (_| | | | | | | (_| |
*  \___/|_|  \__,_|_| |_| |_|\__,_|
*                        Framework
*/


exports.get = (req) => {
  console.log(req);
  let a = (req != null) ? req.a : null
  let b = (req != null) ? req.b : null
  let operation = (req != null) ? req.operation : null
  let errorResponse = []
  if (a == null) {
    errorResponse.push("Error: parameter a is missing")
  }

  if (b == null) {
    errorResponse.push("Error: parameter b is missing")
  }

  if (operation == null) {
    errorResponse.push("Error: parameter operation is missing")
  } else {
    if (operation !== "addition" && operation !== "subtraction" && operation !== "multiplication" && operation !== "division") {
      errorResponse.push(`Error: operation ${operation} is not permited`)
    }
  }

  if (errorResponse.length) {
    return { error: errorResponse };
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
        result = (parseFloat(b) !== 0) ? parseFloat(a) / parseFloat(b) : 0
        break;

      default:
        break;
    }
    return { operation: operation, a: a, b: b, result: result };
  } catch (error) {
    let errorResponse = `Error: ${error}`
    console.log(error);
    return { errors: errorResponse };
  }
};