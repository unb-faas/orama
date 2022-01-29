variable "USECASE" {
  type = string
  default = "lambdaaligner"
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

variable "func" {
    type = string
    default = "../../faas/aws/put/put.zip"
}
