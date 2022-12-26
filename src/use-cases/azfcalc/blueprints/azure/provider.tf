provider "azurerm" {
  features {
    resource_group {
      prevent_deletion_if_contains_resources = false
    }
  }  client_id = var.CLIENT_ID
  client_secret = var.CLIENT_SECRET
  subscription_id = var.SUBSCRIPTION_ID
  tenant_id = var.TENANT_ID
}
