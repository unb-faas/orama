variable "USECASE" {
  type = string
  default = "lambdacalc"
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

variable "funcget" {
    type = string
    default = "../../faas/aws/get/get.zip"
}
