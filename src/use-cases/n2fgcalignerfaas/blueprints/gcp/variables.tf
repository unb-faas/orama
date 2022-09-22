variable "USECASE" {
  type = string
  default = "n2fgcalignerfaas"
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

variable "public_key" {
  type = string
  default = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDN+qyP+ZMtgDUQFG3M6k68DoOIaEEdmVSTORoRT8Up6Q6jaWovpKeol49nBxv+V4KsLMkx0TedkApzuWOb12y6F3wF6Te0VsAjwejWHXSIOpmnVzyz8mPHkJrN+ECZg+uQD4XAueR91TLBGDs7KLigW/36gUDA0Uf2+w3o40bKuhB6qgEtaC0zZwT8FQ57JeU2jjPXfM/EJrfZ7TbSc6zHPHxlSAwySQcwKW4A3rp+guhlGwUA29rxspbNqJ4Tlg/nGNvxDbDvWN6aDUQ9oDoxzJ4BiJGH/LR2/+0mt1yBCm77HCuPhXgi5QG/k0aTFkopJivMbHeA+beleFFpmX1kFjAiP1Xri8LGtlkYbJX2WS/pQFkzFMn3yAXDC6a/fMANekUi9sbFntLYc8qD0bqtMX/QV1HnEeEaZRZIVYsovJvJpibCrHO7QaBggq80TXxSX/sNBPESAyDE9Ht51If6mMClbxtiIAGC+nUkRxDiXadgyEZcUxBiVrBl/KBD7dk= leonardo@Leonardos-MacBook-Pro.local"
}
