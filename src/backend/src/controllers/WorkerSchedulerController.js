const { Kafka } = require("kafkajs");
const clientId = "orama";

const kafka = new Kafka({
  clientId: clientId,
  brokers: [process.env.KAFKA_URL],
});

module.exports = (app) => {
  const schedule = async (parameters) => {
    try {
        console.log(parameters)
        const workers = await getActiveWorkers()
        workers.forEach(async worker => {
            await produce({
                body:{
                    topic:worker.uuid,
                    content: {value:JSON.stringify({operation:'run','parameters':parameters})}
                }
            })
        })
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
