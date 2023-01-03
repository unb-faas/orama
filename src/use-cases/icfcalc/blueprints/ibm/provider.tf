terraform {
  required_providers {
    ibm = {
      source = "IBM-Cloud/ibm"
      version = ">= 1.48.0"
    }
  }
}

provider "ibm" {
    region  = var.region
    # iaas_classic_username = var.IAAS_CLASSIC_USERNAME
    # iaas_classic_api_key = var.IAAS_CLASSIC_API_KEY
    ibmcloud_api_key = var.IBMCLOUD_API_KEY
}
