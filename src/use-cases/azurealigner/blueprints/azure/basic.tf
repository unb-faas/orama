resource "random_string" "random" {
  length           = 4
  special          = false
  upper            = false
  override_special = "/@£$"
}

resource "azurerm_resource_group" "main" {
  name     = "orama-${var.USECASE}-${random_string.random.result}"
  location = var.location
}

resource "azurerm_virtual_network" "main" {
  name                = "orama-${var.USECASE}-${random_string.random.result}-network"
  address_space       = ["10.0.0.0/16"]
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
}

resource "azurerm_subnet" "internal" {
  name                 = "orama-${var.USECASE}-${random_string.random.result}-internal"
  resource_group_name  = azurerm_resource_group.main.name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = ["10.0.2.0/24"]
}

resource "azurerm_public_ip" "public_ip" {
  name                = "orama-${var.USECASE}-${random_string.random.result}-publicIP"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  allocation_method   = "Dynamic"
}

resource "azurerm_network_interface" "main" {
  name                = "orama-${var.USECASE}-${random_string.random.result}-nic-internal"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name

  ip_configuration {
    name                          = "orama-${var.USECASE}-${random_string.random.result}-ipconfig-internal"
    subnet_id                     = azurerm_subnet.internal.id
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id = azurerm_public_ip.public_ip.id
  }
}

resource "azurerm_virtual_machine" "main" {
  name                  = "orama-${var.USECASE}-${random_string.random.result}-vm"
  location              = azurerm_resource_group.main.location
  resource_group_name   = azurerm_resource_group.main.name
  network_interface_ids = [azurerm_network_interface.main.id]
  vm_size               = var.instancetype

  delete_os_disk_on_termination = true

  delete_data_disks_on_termination = true

  storage_image_reference {
    publisher = var.image_publisher
    offer     = var.image_offer
    sku       = var.image_sku
    version   = var.image_version
  }
  storage_os_disk {
    name              = "orama-${var.USECASE}-${random_string.random.result}-disc"
    caching           = "ReadWrite"
    create_option     = "FromImage"
    managed_disk_type = "Standard_LRS"
  }
  os_profile {
    computer_name  = "orama-${var.USECASE}-${random_string.random.result}"
    admin_username = "orama-${var.USECASE}-${random_string.random.result}"
    admin_password = "orama-${var.USECASE}-${random_string.random.result}PAssWD"
    custom_data = <<-EOF
              #!/bin/bash
              sleep 10
              sudo /usr/bin/apt-get update
              sudo /usr/bin/apt-get install -y git python3-pip python3-venv
              /usr/bin/python3 -m venv .venv
              source .venv/bin/activate
              mkdir -p /app
              cd /app
              /usr/bin/git clone https://github.com/unb-faas/sequence_comparison_app.git
              cd /app/sequence_comparison_app/algorithms/hirschberg/Python/iaas/azure/
              echo 'connect_str=${var.storage_account_string_connection}' >> .env
              sed -i "s/\/localhost/\/${var.instancetype}/" main.py
              sudo /usr/bin/pip3 install -r ./requirements.txt 
              cp /usr/local/bin/uvicorn /usr/bin/uvicorn
              ./start.sh &
            EOF
  }
  os_profile_linux_config {
    disable_password_authentication = false
  }
  tags = {
    environment = "staging"
  }
}

