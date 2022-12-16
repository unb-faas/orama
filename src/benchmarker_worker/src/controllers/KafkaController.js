const { Kafka } = require('kafkajs')
const KAFKA_URL = process.env.KAFKA_URL


    const bindKafkaConsumer = async (uuid, callback) =>{
        const kafka = new Kafka({
            clientId: uuid,
            brokers: [KAFKA_URL],
        })
        
        const consumer = kafka.consumer({ groupId: uuid })
        await consumer.connect()
        await consumer.subscribe({ topic: uuid, fromBeginning: true })
        await consumer.run({
        eachMessage: callback,
        })
    }
  
exports.bindKafkaConsumer = bindKafkaConsumer