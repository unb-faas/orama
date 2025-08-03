resource "google_storage_bucket" "bucket-get" {
  name = "orama-${var.USECASE}-get-${random_string.random.result}"
  location      = "US"
}

resource "google_storage_bucket_object" "archive-get" {
  name   = "get.zip"
  bucket = google_storage_bucket.bucket-get.name
  source = var.funcget
}

resource "google_cloudfunctions_function" "function-get" {
  name        = "orama-${var.USECASE}-get-${random_string.random.result}"
  description = "Orama Framework get function"
  runtime     = "nodejs18"
  available_memory_mb   = var.memory
  max_instances         = var.max_instances
  source_archive_bucket = google_storage_bucket.bucket-get.name
  source_archive_object = google_storage_bucket_object.archive-get.name
  trigger_http          = true
  entry_point           = "get"
}

resource "google_cloudfunctions_function_iam_member" "invoker-get" {
  project        = google_cloudfunctions_function.function-get.project
  region         = google_cloudfunctions_function.function-get.region
  cloud_function = google_cloudfunctions_function.function-get.name

  role   = "roles/cloudfunctions.invoker"
  member = "allUsers"
}