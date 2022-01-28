variable "USECASE" {
  type = string
  default = "ec2aligner"
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

variable "instancetype" {
  type = string
}

variable "ami" {
  type = string
}