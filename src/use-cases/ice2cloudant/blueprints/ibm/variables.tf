variable "USECASE" {
  type    = string
  default = "ice2cloudant"
}

variable "IBMCLOUD_API_KEY" {
  type = string
  sensitive = true
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

variable "funcdelete" {
  type    = string
  default = "../../faas/ibm/delete/delete-generated.zip"
}

variable "funcpost" {
  type    = string
  default = "../../faas/ibm/post/post-generated.zip"
}