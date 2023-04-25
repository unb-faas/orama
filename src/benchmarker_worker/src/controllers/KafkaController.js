const { Kafka } = require('kafkajs')
const { Partitioners } = require('kafkajs')
const KAFKA_URL = process.env.KAFKA_URL

const bindKafkaConsumer = async (uuid, callback) =>{
    const kafka = new Kafka({
        clientId: 'oramaWorker',
        brokers: [KAFKA_URL],
        connectionTimeout: 3000,
        requestTimeout: 25000
    })
    const consumer = kafka.consumer({ 
        groupId: uuid, 
        allowAutoTopicCreation: true,
        maxWaitTimeInMs: 5000,
        retry: { retries: 10 }, 
    })
    await consumer.connect()
    await consumer.subscribe({ topic: uuid, fromBeginning: true }).catch(async ()=>{
        setTimeout(async ()=>{await consumer.subscribe({ topic: uuid, fromBeginning: true })},2000)
    })
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
        const producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner });
        await producer.connect();
        await producer.send({
        topic: topic,
        messages: [content],
        });
        await producer.disconnect();
        console.log("Produced on topic",topic)
    } catch (error) {
        console.error(error)
    }
    };
  
exports.bindKafkaConsumer = bindKafkaConsumer
exports.produce = produce