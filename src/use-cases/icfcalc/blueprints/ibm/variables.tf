variable "USECASE" {
  type    = string
  default = "icfcalc"
}

variable "region" {
  type    = string
  default = "us-east"
  # Region ID = Region
  # us-east   = Washington DC
  # us-south  = Dallas
  # eu-gb     = London (UK South)
  # eu-de     = Frankfurt
  # jp-tok    = Tokyo
  # au-syd    = Sydney
}

variable "short_name" {
  default = "ibm"
}

variable "resource_group" {
  type    = string
  default = "Default"
}

variable "namespace" {
  type    = string
  default = "orama"
}

variable "IBMCLOUD_API_KEY" {
  type = string
  default = "ulW7SXhb34bs703mV34Zy9zHV-MkViAa8iFXbwoaWvUH"
}

variable "memory" {
  type    = number
  default = 128
}

variable "timeout" {
  type    = number
  default = 1000
}

variable "funcname" {
  default = "orama-icfcalc"
}

variable "funcget" {
  type    = string
  default = "../../faas/ibm/get/index.js"
}
