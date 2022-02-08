resource "azurerm_resource_group" "funcdeploy" {
  name     = "orama-${var.USECASE}-${random_string.random.result}-rg"
  location = var.region
}

resource "azurerm_storage_account" "funcdeploy" {
  name                     = "orama${var.USECASE}${random_string.random.result}stg"
  resource_group_name      = azurerm_resource_group.funcdeploy.name
  location                 = azurerm_resource_group.funcdeploy.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_storage_container" "funcdeploy" {
  name                  = "contents"
  storage_account_name  = azurerm_storage_account.funcdeploy.name
  container_access_type = "private"
}

resource "azurerm_storage_container" "storage_container" {
 name = "orama-${var.USECASE}-${random_string.random.result}"
 storage_account_name = "${azurerm_storage_account.funcdeploy.name}"
 container_access_type = "private"
}

resource "azurerm_storage_blob" "storage_blob" {
 name = "orama-${var.USECASE}-${random_string.random.result}.zip"
 storage_account_name = "${azurerm_storage_account.funcdeploy.name}"
 storage_container_name = "${azurerm_storage_container.storage_container.name}"
 type = "Block"
 source = var.funcput
}

data "azurerm_storage_account_sas" "storage_sas" {
  connection_string = "${azurerm_storage_account.funcdeploy.primary_connection_string}"
  https_only        = true

  resource_types {
    service   = false
    container = false
    object    = true
  }

  services {
    blob  = true
    queue = false
    table = false
    file  = false
  }

  start  = "2019-09-01"
  expiry = "2029-09-01"

  permissions {
    read    = true
    write   = false
    delete  = false
    list    = false
    add     = false
    create  = false
    update  = false
    process = false
  }
}

resource "azurerm_application_insights" "funcdeploy" {
  name                = "orama-${var.USECASE}-${random_string.random.result}-appinsights"
  location            = azurerm_resource_group.funcdeploy.location
  resource_group_name = azurerm_resource_group.funcdeploy.name
  application_type    = "web"

  # https://github.com/terraform-providers/terraform-provider-azurerm/issues/1303
  tags = {
    "hidden-link:${azurerm_resource_group.funcdeploy.id}/providers/Microsoft.Web/sites/orama-${var.USECASE}-${random_string.random.result}-func" = "Resource"
  }

}

resource "azurerm_app_service_plan" "funcdeploy" {
  name                = "orama-${var.USECASE}-${random_string.random.result}-functions-consumption-asp"
  location            = azurerm_resource_group.funcdeploy.location
  resource_group_name = azurerm_resource_group.funcdeploy.name
  kind                = "FunctionApp"
  reserved            = true
  maximum_elastic_worker_count = 200

  sku {
    tier = "Dynamic"
    size = "Y1"
  }
}

resource "azurerm_function_app" "funcdeploy" {
  name                       = "orama-${var.USECASE}-${random_string.random.result}-func"
  location                   = azurerm_resource_group.funcdeploy.location
  resource_group_name        = azurerm_resource_group.funcdeploy.name
  app_service_plan_id        = azurerm_app_service_plan.funcdeploy.id
  storage_account_name       = azurerm_storage_account.funcdeploy.name
  storage_account_access_key = azurerm_storage_account.funcdeploy.primary_access_key
  https_only                 = true
  version                    = "~4"
  os_type                    = "linux"
  app_settings = {
      "SCM_DO_BUILD_DURING_DEPLOYMENT" = true
      "ENABLE_ORYX_BUILD" = true
      "WEBSITE_RUN_FROM_PACKAGE" = "1"
      "FUNCTIONS_WORKER_RUNTIME" = "python"
      "APPINSIGHTS_INSTRUMENTATIONKEY" = "${azurerm_application_insights.funcdeploy.instrumentation_key}"
      "APPLICATIONINSIGHTS_CONNECTION_STRING" = "InstrumentationKey=${azurerm_application_insights.funcdeploy.instrumentation_key};IngestionEndpoint=https://japaneast-0.in.applicationinsights.azure.com/"
      "HASH" = "${filebase64sha256("${var.funcput}")}"
      "WEBSITE_USE_ZIP" = "https://${azurerm_storage_account.funcdeploy.name}.blob.core.windows.net/${azurerm_storage_container.storage_container.name}/${azurerm_storage_blob.storage_blob.name}${data.azurerm_storage_account_sas.storage_sas.sas}"
      "WEBSITE_RUN_FROM_PACKAGE" = "https://${azurerm_storage_account.funcdeploy.name}.blob.core.windows.net/${azurerm_storage_container.storage_container.name}/${azurerm_storage_blob.storage_blob.name}${data.azurerm_storage_account_sas.storage_sas.sas}"
  }

  site_config {
        linux_fx_version= "Python|3.8"        
        ftps_state = "Disabled"
    }

  # Enable if you need Managed Identity
  # identity {
  #   type = "SystemAssigned"
  # }
}

# resource "azurerm_function_app_slot" "funcdeploy" {
#   name                       = "orama-${var.USECASE}-${random_string.random.result}-func-slot"
#   location                   = azurerm_resource_group.funcdeploy.location
#   resource_group_name        = azurerm_resource_group.funcdeploy.name
#   app_service_plan_id        = azurerm_app_service_plan.funcdeploy.id
#   function_app_name          = azurerm_function_app.funcdeploy.name
#   storage_account_name       = azurerm_storage_account.funcdeploy.name
#   storage_account_access_key = azurerm_storage_account.funcdeploy.primary_access_key
# }