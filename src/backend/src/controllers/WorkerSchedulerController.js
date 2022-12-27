const { Kafka } = require("kafkajs");
const KAFKA_URL = process.env.KAFKA_URL

module.exports = (app) => {
  const schedule = async (parameters) => {      
    try {
        return new Promise(async(resolve, reject) => {
            //  Get Active and Health Workers
            let workers = await getActiveWorkers()
            
            //  Distribute the requests equally over the workers
            const slices = workers.length
            let requestBucket = parseInt(parameters.concurrence)
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

            // If rest some request, them give it to the first worker
            const restPosition = 0 
            workers[restPosition].requests += requestBucket

            // Remove workers with none requests
            workers = workers.filter(worker => worker.requests > 0)

            // Create a Kafka message for each Worker Job
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

            // Wait until all jobs are done, that is, all partial result come
            let maxTentative = 1200 //twenty minutes
            let partialResult = {data:[]}
            requestBucket=0
            while(requestBucket!=parameters.concurrence){
                requestBucket = 0
                partialResult = await app.controllers.BenchmarkExecutionPartialResultController.list({query:{size:999999, id_benchmark_execution:parameters.id, concurrence: parameters.concurrence, repetition:parameters.repetition}})
                partialResult.data.forEach(result=>{
                    requestBucket += result.requests
                })
                console.log(`Results received: ${requestBucket}/${parameters.concurrence} - Tentatives left: ${maxTentative}`)
                await new Promise(resolve => setTimeout(resolve, 1000));
                maxTentative--
                // In case of too much time, then abort
                if (maxTentative===0){
                    //  Update finished
                    await app.controllers.BenchmarkExecutionController.update({params:{id:parameters.id},body:{finished:-1}})
                    reject()
                }
            }

            // Select warm up results
            const partialResultWithOutWarmUp = partialResult.data.filter(res => !(res.repetition == 'warmup'))
            const partialResultWithWarmUp = partialResult.data.filter(res => (res.repetition == 'warmup'))

            // Consolidate the partial results into a unique result
            const consolidateResults = partialResultWithOutWarmUp.reduce((acc,curr)=>acc.concat(curr.results.list), [])
            benchmarkExecution = await app.controllers.BenchmarkExecutionController.get({params:{id:parameters.id}})

            if (parameters.repetition != "warmup"){
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
            } else {
                benchmarkExecution.results["warm_up"] = 1
                benchmarkExecution.results["warm_up_raw"] = partialResultWithWarmUp[0].results.list
            }
            
            //  Update main results
            await app.controllers.BenchmarkExecutionController.update({params:{id:parameters.id},body:{results:benchmarkExecution.results}})
            
            // Return
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
    return workers
  };

  const produce = async (req, res) => {
    const kafka = new Kafka({
        clientId: "orama",
        brokers: [KAFKA_URL],
    });

    try {
      const { topic, content } = req.body;
      const producer = kafka.producer();
      await producer.connect();
      await producer.send({
        topic: topic,
        messages: [content],
      });
      await producer.disconnect();
      console.log("Produced on topic",topic)
      return (res) ? res.status(200).json({ result: true }) : true
    } catch (error) {
      return (res) ? res.status(500).json(`Error: ${error}`) : true
    }
  };

  const bindKafkaConsumerWorkers = async (topic, clientID, callback) =>{
    const kafka = new Kafka({
        clientId: clientID,
        brokers: [KAFKA_URL],
    });
    const consumer = kafka.consumer({ groupId: clientID })
    await consumer.connect()
    await consumer.subscribe({ topic: topic, fromBeginning: true })
    await consumer.run({
        eachMessage: callback,
    })
  }

  return {
    produce,
    schedule,
    bindKafkaConsumerWorkers
  };
};
