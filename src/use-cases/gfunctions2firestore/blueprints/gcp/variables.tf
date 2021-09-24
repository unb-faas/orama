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

variable "funcdelete" {
    type = string
    default = "../../faas/gcp/delete/delete.zip"
}

variable "funcget" {
    type = string
    default = "../../faas/gcp/get/get.zip"
}

variable "funcpost" {
    type = string
    default = "../../faas/gcp/post/post.zip"
}