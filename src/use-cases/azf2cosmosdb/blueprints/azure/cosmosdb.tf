resource "azurerm_cosmosdb_account" "db" {
  name                = "orama-${var.USECASE}-${random_string.random.result}-cosmosdb"
  location            = azurerm_resource_group.funcdeploy.location
  resource_group_name = azurerm_resource_group.funcdeploy.name
  offer_type          = "Standard"
  kind                = "GlobalDocumentDB"
  enable_free_tier    = true

  enable_automatic_failover = true

  capabilities {
    name = "EnableAggregationPipeline"
  }

  #capabilities {
  #  name = "mongoEnableDocLevelTTL"
  #}

  #capabilities {
  #  name = "MongoDBv3.4"
  #}

  #capabilities {
  #  name = "EnableMongo"
  #}

  consistency_policy {
    consistency_level       = "BoundedStaleness"
    max_interval_in_seconds = 300
    max_staleness_prefix    = 100000
  }

  #geo_location {
  #  location          = var.failover_location
  #  failover_priority = 1
  #}

  geo_location {
    location          = azurerm_resource_group.funcdeploy.location
    failover_priority = 0
  }
}

#resource "azurerm_cosmosdb_mongo_database" "database" {
#  name                = "orama-${var.USECASE}-${random_string.random.result}-database"
#  resource_group_name = azurerm_cosmosdb_account.db.resource_group_name
#  account_name        = azurerm_cosmosdb_account.db.name
#  throughput          = 400
#}

#resource "azurerm_cosmosdb_mongo_collection" "collection" {
#  name                = "orama-${var.USECASE}"
#  resource_group_name = azurerm_cosmosdb_account.db.resource_group_name
#  account_name        = azurerm_cosmosdb_account.db.name
#  database_name       = azurerm_cosmosdb_mongo_database.database.name

#  default_ttl_seconds = "777"
#  shard_key           = "uniqueKey"
#  throughput          = 400

#  index {
#    keys   = ["_id"]
#    unique = true
#  }
#}