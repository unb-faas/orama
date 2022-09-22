
data "azurerm_public_ip" "search" {
  name                = azurerm_public_ip.public_ip.name
  resource_group_name = azurerm_virtual_machine.main.resource_group_name
}

output "orama_azure_post_url" {
  value = "http://${data.azurerm_public_ip.search.ip_address}:3000"
}