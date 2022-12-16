const { run } = require('../controllers/BenchmarkController')

const dispatch = (message, uuid) => {
    console.log("Message received")
    try{
        const objectMessage = JSON.parse(message)
        if (objectMessage.operation){
            switch (objectMessage.operation) {
                case 'run':
                    console.log(`Operation ${objectMessage.operation} detected`)
                    run(objectMessage.parameters, uuid)
                    break;
            
                default:
                    console.log(`Operation ${objectMessage.operation} not configured`)
                    break;
            }
        } else {
            console.log("Error: message theres no operation defined")
        }
    } catch (e){
        console.error("Message is not in JSON format", e)
    } 
}
  
exports.dispatch = dispatch