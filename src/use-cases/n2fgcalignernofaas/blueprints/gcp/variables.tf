variable "USECASE" {
  type = string
  default = "n2fgcalignernofaas"
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

variable "zone" {
  type = string
  default = "us-central1-a"
}

variable "instancetype" {
  type = string
}

variable "image" {
  type = string
}