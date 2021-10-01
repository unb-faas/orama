variable "USECASE" {
  type = string
  default = "lambda2s3"
}

variable "AWS_ACCESS_KEY_ID" {
  type = string
}

variable "AWS_SECRET_ACCESS_KEY" {
  type = string
}

variable "region" {
  type = string
  default = "us-east-1"
}

variable "memory" {
  type = number
  default = 128
}

variable "funcdelete" {
    type = string
    default = "../../faas/aws/delete/delete.zip"
}
variable "funcget" {
    type = string
    default = "../../faas/aws/get/get.zip"
}
variable "funcpost" {
    type = string
    default = "../../faas/aws/post/post.zip"
}