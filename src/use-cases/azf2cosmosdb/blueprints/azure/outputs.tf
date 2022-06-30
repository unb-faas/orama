output "orama_azure_get_url" {
  value = "https://${azurerm_function_app.funcdeploy-linux.default_hostname}/api/func"
}