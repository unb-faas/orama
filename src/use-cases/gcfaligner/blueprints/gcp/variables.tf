variable "USECASE" {
  type = string
  default = "gcfaligner"
}

variable "GCP_JSON_FILE" {
  type = string
}

variable "GCP_PROJECT_ID" {
  type    = string
}

variable "region" {
  type = string
  default = "us-central1"
}

variable "memory" {
  type = number
  default = 128
}

variable "max_instances" {
  type = number
  default = 1000
}

variable "funcput" {
    type = string
    default = "../../faas/gcp/put/put.zip"
}