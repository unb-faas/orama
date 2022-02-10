
const express = require('express')
const consign = require("consign");

const app = express()
app.basePath = "/"
const port = 3200

app.use('/logs', express.static('/logs'));

consign()
    .then("./config/middlewares.js")
    .then("./swagger/swagger.js")
    .then("./controllers")
    .then("./routes.js")
    .into(app);

app.get('/', function(req, res) {
    res.redirect('/orchestrator/api-doc');
});

app.listen(port, () => {
    console.log(`API on port ${port}`)
})
