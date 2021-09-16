provider "google" {
  credentials = file("credentials")
  project     = var.project_id
  region      = var.region

}

terraform {
  required_version = ">= 0.13.1"
}

resource "random_integer" "ri" {
  min = 10000
  max = 99999
}
