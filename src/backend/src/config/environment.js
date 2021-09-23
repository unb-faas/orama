const dotenv = require("dotenv");
const environment = process.env.NODE_ENVIRONMENT || "development";
const config = dotenv.config({ path: `src/config/${environment}/.env` });
module.exports = {
  configuration: {
    environment: environment,
    serviceName:"API Backend",
    apiVersion: 1,
    api_url: process.env.API_URL || config.parsed.API_URL,
    host: process.env.HOST || config.parsed.HOST,
    port: process.env.PORT || config.parsed.PORT,
    dbclient: config.parsed.DB_CLIENT,
    dbhost: process.env.DB_HOST || config.parsed.DB_HOST,
    dbname: process.env.DB_NAME || config.parsed.DB_NAME,
    dbport: process.env.DB_PORT || config.parsed.DB_PORT,
    dbuser: process.env.DB_USER || config.parsed.DB_USER,
    dbpass: process.env.DB_PASS || config.parsed.DB_PASS
  },
};