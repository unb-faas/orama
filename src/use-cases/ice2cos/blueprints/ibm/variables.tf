variable "USECASE" {
  type    = string
  default = "ice2cos"
}

variable "IBMCLOUD_API_KEY" {
  type      = string
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
