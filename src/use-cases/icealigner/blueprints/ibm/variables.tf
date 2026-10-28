variable "USECASE" {
  type    = string
  default = "icealigner"
}

variable "IBMCLOUD_API_KEY" {
  type      = string
  sensitive = true
}

variable "region" {
  type    = string
  default = "us-south"
}

# Code Engine functions only accept fixed CPU/memory pairs (1 vCPU <-> 4G).
variable "cpu" {
  type    = string
  default = "1"
}

variable "memory" {
  type    = number
  default = 4
}
