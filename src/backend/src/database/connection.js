const knex = require("knex");
const config = require("../../knexfile.js");
const connection = knex(config);

connection.raw('select 1+1 as result').catch(err => {
  console.log(err);
  process.exit(1);
});

module.exports = connection;
