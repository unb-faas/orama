terraform {
  required_version = ">= 1.0.0"
  required_providers {
    ibm = {
      source  = "IBM-Cloud/ibm"
      version = ">= 1.75.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = ">= 2.0.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "3.6.0"
    }
  }
}

provider "ibm" {
  ibmcloud_api_key = var.IBMCLOUD_API_KEY
  region           = var.region
}
