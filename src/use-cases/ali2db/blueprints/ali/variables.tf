variable "USECASE" {
  type = string
  default = "ali2db"
}

variable "region" {
  type = string
  default= "us-east-1"
}

variable "tablestore_host" {
  type = string
  default= "vpc.tablestore.aliyuncs.com"
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
  default = "oramaalidb" # max: 10 chars, a-z
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
