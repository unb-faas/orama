variable "USECASE" {
  type = string
  default = "n2fazurealignerfaas"
}

variable "CLIENT_SECRET" {
  type = string
}

variable "CLIENT_ID" {
  type = string
}

variable "SUBSCRIPTION_ID" {
  type = string
}

variable "TENANT_ID" {
  type = string
}

variable "location" {
  type = string
  default = "West US"
}

variable "instancetype" {
  type = string
}

variable "image_publisher" {
  type = string
  default = "Canonical"
}

variable "image_offer" {
  type = string
  default = "UbuntuServer"
}

variable "image_sku" {
  type = string
  default = "16.04-LTS"
}

variable "image_version" {
  type = string
  default = "latest"
}