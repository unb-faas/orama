const express = require('express')
const consign = require("consign");

const app = express()
app.basePath = "/"
const port = 3100
app.locals.semaphore = true
app.locals.execution = {}

app.use('/reports', express.static('/reports'));

consign()
    .then("./config/middlewares.js")
    .then("./swagger/swagger.js")
    .then("./controllers")
    .then("./routes.js")
    .into(app);

app.get('/', function(req, res) {
    res.redirect('/benchmarker/api-doc');
});

app.listen(port, () => {
    console.log(`API on port ${port}`)
})