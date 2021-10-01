provider "google" {
  credentials = file(var.GCP_JSON_FILE)
  project     = var.GCP_PROJECT_ID
  region      = var.region
}

terraform {
  required_version = ">= 0.13.1"
}
