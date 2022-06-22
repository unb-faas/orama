variable "USECASE" {
  type = string
  default = "azfcalc"
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

variable "region" {
  type = string
  default = "westus"
}

variable "memory" {
  type = number
  default = 128
}

variable "max_instances" {
  type = number
  default = 1000
}

variable "funcget" {
    type = string
    default = "../../faas/azure/get/get.zip"
}