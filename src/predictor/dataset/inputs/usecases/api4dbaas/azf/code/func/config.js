const config = {
    endpoint: process.env.COSMOSDB_ENDPOINT,
    key: process.env.COSMOSDB_PRIMARY_KEY,
    databaseId: "CosmosAPI",
    containerId: "Items",
    partitionKey: { kind: "Hash", paths: ["/category"] }
  };
  
  module.exports = config;