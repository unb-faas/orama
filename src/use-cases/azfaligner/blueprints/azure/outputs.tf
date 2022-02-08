output "orama_azure_put_url" {
  value = "https://${azurerm_function_app.funcdeploy.default_hostname}/api/align"
}