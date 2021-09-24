provider "google" {
  credentials = file(var.GCP_JSON_FILE)
  project     = var.GCP_PROJECT_ID
  region      = var.region
}

terraform {
  required_version = ">= 0.13.1"
}

resource "random_integer" "ri" {
  min = 10000
  max = 99999
}
