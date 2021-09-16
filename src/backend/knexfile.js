// Update with your config settings.
const environment = require("./src/config/environment");

module.exports = {
  client: environment.configuration.dbclient,
  connection: {
    host: environment.configuration.dbhost,
    database: environment.configuration.dbname,
    port: environment.configuration.dbport,
    user: environment.configuration.dbuser,
    password: environment.configuration.dbpass,
  },
  pool: {
    min: 2,
    max: 10000,
    createTimeoutMillis: 3000,
    acquireTimeoutMillis: 30000,
    idleTimeoutMillis: 30000,
    reapIntervalMillis: 1000,
    createRetryIntervalMillis: 100,
    propagateCreateError: false 
  },
  migrations: {
    tableName: "knex_migrations",
    directory: "./src/database/migrations",
  },
  seeds: {
    directory: "./src/database/seeds",
  },
  useNullAsDefault: true,
};