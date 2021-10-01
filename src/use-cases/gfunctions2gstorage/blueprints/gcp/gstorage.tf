resource "google_storage_bucket" "main-bucket" {
  name = "orama${var.USECASE}${random_string.random.result}"
}