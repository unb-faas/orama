resource "google_storage_bucket" "bucket-get" {
  name = "orama-get-${random_string.random.result}"
}

resource "google_storage_bucket_object" "archive-get" {
  name   = "get.zip"
  bucket = google_storage_bucket.bucket-get.name
  source = var.funcget
}

resource "google_cloudfunctions_function" "function-get" {
  name        = "function-get-${random_string.random.result}"
  description = "Orama Framework get function"
  runtime     = "nodejs12"

  available_memory_mb   = var.memory
  source_archive_bucket = google_storage_bucket.bucket-get.name
  source_archive_object = google_storage_bucket_object.archive-get.name
  trigger_http          = true
  entry_point           = "get"
  environment_variables = {
    TABLE_NAME = "oramatb${random_string.random.result}"
  }
}

resource "google_cloudfunctions_function_iam_member" "invoker-get" {
  project        = google_cloudfunctions_function.function-get.project
  region         = google_cloudfunctions_function.function-get.region
  cloud_function = google_cloudfunctions_function.function-get.name

  role   = "roles/cloudfunctions.invoker"
  member = "allUsers"
}