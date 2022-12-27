const { Kafka } = require('kafkajs')
const KAFKA_URL = process.env.KAFKA_URL


const bindKafkaConsumer = async (uuid, callback) =>{
    const kafka = new Kafka({
        clientId: 'orama',
        brokers: [KAFKA_URL],
    })
    
    const consumer = kafka.consumer({ groupId: uuid })
    await consumer.connect()
    await consumer.subscribe({ topic: uuid, fromBeginning: true })
    await consumer.run({
        eachMessage: callback,
    })
}

const produce = async (topic, content) => {
    const kafka = new Kafka({
        clientId: 'oramaWorker',
        brokers: [KAFKA_URL],
    })
    try {
        const producer = kafka.producer();
        await producer.connect();
        await producer.send({
        topic: topic,
        messages: [content],
        });
        await producer.disconnect();
        console.log("Finished")
    } catch (error) {
        console.error(error)
    }
    };
  
exports.bindKafkaConsumer = bindKafkaConsumer
exports.produce = produce