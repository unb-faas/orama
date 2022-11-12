variable "USECASE" {
  type = string
  default = "ali2s3"
}

variable "region" {
  type = string
  default= "cn-hongkong"
}

variable "short_name" {
  default = "ali"
}

variable "ALICLOUD_ACCESS_KEY" {
  type = string
}

variable "ALICLOUD_SECRET_KEY" {
  type = string
}

variable "memory" {
  type = number
  default = 128
}

variable "funcname" {
  default = "orama-ali2s3"
}

variable "funcdelete" {
    type = string
    default = "../../faas/ali/delete/delete.zip"
}

variable "funcget" {
    type = string
    default = "../../faas/ali/get/get.zip"
}

variable "funcpost" {
    type = string
    default = "../../faas/ali/post/post.zip"
}