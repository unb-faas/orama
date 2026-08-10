variable "USECASE" {
  type    = string
  default = "icecalc"
}

variable "IBMCLOUD_API_KEY" {
  type = string
  //sensitive = true
}

variable "region" {
  type    = string
  default = "us-south"
}

variable "memory" {
  type    = number
  default = 1
}

variable "funcget" {
  type    = string
  default = "../../faas/ibm/get/get-generated.zip"
}
