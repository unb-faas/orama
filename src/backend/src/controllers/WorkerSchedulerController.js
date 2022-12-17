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
            if (requestBucket>slices){
                workers = workers.map(worker=>{
                    worker.requests = block
                    requestBucket -= block
                    return worker
                })
            } else {
                workers = workers.map(worker=>{
                    worker.requests = 0
                    return worker
                })
            }
            const restPosition = 0 //getRandomInt(slices-1)
            workers[restPosition].requests += requestBucket
            workers.forEach(async worker => {
                if (worker.requests > 0){
                    const tempPar = parameters
                    tempPar.requests = worker.requests
                    await produce({
                        body:{
                            topic:worker.uuid,
                            content: {value:JSON.stringify({operation:'run','parameters':tempPar})}
                        }
                    })
                }
            })

            let maxTentative = 600 //ten minutes
            let partialResult = {data:[]}
            requestBucket=0
            while(requestBucket!=parameters.concurrence){
                requestBucket = 0
                partialResult = await app.controllers.BenchmarkExecutionPartialResultController.list({query:{id_benchmark_execution:parameters.id, concurrence: parameters.concurrence, repetition:parameters.repetition}})
                partialResult.data.forEach(result=>{
                    requestBucket += result.requests
                })
                console.log("requestBucket",requestBucket)
                await new Promise(resolve => setTimeout(resolve, 1000));
                maxTentative--
                if (maxTentative===0){
                    reject()
                }
            }

            const consolidateResults = partialResult.data.reduce((acc,curr)=>acc.concat(curr.results.list), [])
            benchmarkExecution = await app.controllers.BenchmarkExecutionController.get({params:{id:parameters.id}})
            if (!benchmarkExecution.results.raw){
                benchmarkExecution.results.raw = {}
                benchmarkExecution.results.raw[parameters.repetition] = {}
                benchmarkExecution.results.raw[parameters.repetition][parameters.concurrence] = {}
            }

            if (typeof benchmarkExecution.results.raw[parameters.repetition] == "undefined"){
                benchmarkExecution.results.raw[parameters.repetition] = {}
            }

            if (typeof benchmarkExecution.results.raw[parameters.repetition][parameters.concurrence] == "undefined"){
                benchmarkExecution.results.raw[parameters.repetition][parameters.concurrence] = {}
            }
            
            benchmarkExecution.results["raw"][parameters.repetition][parameters.concurrence] = {...benchmarkExecution.results["raw"][parameters.repetition][parameters.concurrence],...consolidateResults}
            await app.controllers.BenchmarkExecutionController.update({params:{id:parameters.id},body:{results:benchmarkExecution.results}})
            
            //In case of repetition zero (then is them warm_up)
            //if (parameters.)
            
            //results["warm_up"] = 1
                // if (warmUprs && warmUprs.data){
                //   results["warm_up_raw"] = warmUprs.data
                // }  
            
            
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
