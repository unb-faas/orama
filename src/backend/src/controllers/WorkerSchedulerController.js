const { Kafka } = require("kafkajs");
const clientId = "orama";

const kafka = new Kafka({
  clientId: clientId,
  brokers: [process.env.KAFKA_URL],
});

module.exports = (app) => {
  const schedule = async (parameters) => {
    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }
      
    try {
        return new Promise(async(resolve, reject) => {
            let workers = await getActiveWorkers()
            const slices = workers.length
            let requestBucket = parameters.concurrence
            const block = Math.floor(requestBucket / slices)
            workers = workers.map(worker=>{
                worker.requests = block
                requestBucket -= block
                return worker
            })    
            const restPosition = getRandomInt(slices-1)
            workers[restPosition].concurrence += requestBucket
            workers.forEach(async worker => {
                const tempPar = parameters
                tempPar.requests = worker.requests
                await produce({
                    body:{
                        topic:worker.uuid,
                        content: {value:JSON.stringify({operation:'run','parameters':tempPar})}
                    }
                })
            })

            console.log("Waiting........")

            while(requestBucket!=parameters.concurrence){
                requestBucket = 0
                const partialResult = await app.controllers.BenchmarkExecutionPartialResultController.list({query:{id_benchmark_execution:parameters.id}})
                partialResult.data.forEach(result=>{
                    requestBucket += result.concurrence
                })
                console.log("requestBucker",requestBucket)
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            resolve()
        });
    } catch (error) {
        console.error(error)
      return `Error: ${error}`;
    }
  };

  const getActiveWorkers = async () => {
    let workers = await app.controllers.WorkerController.list({query:{filterActive:1, size:9999}})
    workers = workers.data.filter((row)=>row.health===1)
    //console.log(workers)
    return workers
  };

  const produce = async (req, res) => {
    try {
      const { topic, content } = req.body;
      const producer = kafka.producer();
      await producer.connect();
      await producer.send({
        topic: topic,
        messages: [content],
      });
      await producer.disconnect();
      return (res) ? res.status(200).json({ result: true }) : true
    } catch (error) {
      return (res) ? res.status(500).json(`Error: ${error}`) : true
    }
  };

  return {
    produce,
    schedule,
  };
};
