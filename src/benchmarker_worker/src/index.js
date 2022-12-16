const { bindKafkaConsumer } = require('./controllers/KafkaController')
const { healthcheck } = require('./controllers/HealthController')
const { dispatch } = require('./controllers/MessagesController')
const { v4: uuidv4 } = require('uuid');
const uuid = uuidv4()
const healthcheck_interval = process.env.HEALTH_CHECK_INTERVAL || 5000
setInterval(()=>{healthcheck(uuid)}, healthcheck_interval);
bindKafkaConsumer(uuid, async ({ topic, partition, message }) => {
    dispatch(message.value.toString(), uuid)
})
setTimeout(()=>{console.log("Hello, my uuid is: ", uuid)}, 500)