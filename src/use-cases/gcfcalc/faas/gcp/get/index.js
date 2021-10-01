/*
*   ___                            
*  / _ \ _ __ __ _ _ __ ___   __ _ 
* | | | | '__/ _` | '_ ` _ \ / _` |
* | |_| | | | (_| | | | | | | (_| |
*  \___/|_|  \__,_|_| |_| |_|\__,_|
*                        Framework
*/

'use strict';

exports.get = async (req, res) => {
  try {
    const a = (req.query.a) ? (req.query.a) : null
    const b = (req.query.b) ? (req.query.b) : null
    const operation = (req.query.operation) ? (req.query.operation) : null
    const errorResponse = []

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
      res.status(500).send({errors:errorResponse});
    }
      
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
    res.status(200).send({operation:operation,a:a,b:b,result:result});
  } catch (err) {
    console.error(new Error(err.message));
    res.status(500).send(err.message);
  }
};