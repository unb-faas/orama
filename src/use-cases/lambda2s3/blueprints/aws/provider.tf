terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "4.67.0"
    }
  }
}

provider "aws" {
    region  = var.region
    access_key = var.AWS_ACCESS_KEY_ID
    secret_key = var.AWS_SECRET_ACCESS_KEY
}