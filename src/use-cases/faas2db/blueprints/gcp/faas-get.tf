resource "google_storage_bucket" "bucket-get" {
  name = "faas-get-bucket-${random_integer.ri.result}"
}

resource "google_storage_bucket_object" "archive-get" {
  name   = "get.zip"
  bucket = google_storage_bucket.bucket-get.name
  source = var.funcget
}

resource "google_cloudfunctions_function" "function-get" {
  name        = "function-get-${random_integer.ri.result}"
  description = "My function get"
  runtime     = "nodejs12"

  available_memory_mb   = var.memory
  source_archive_bucket = google_storage_bucket.bucket-get.name
  source_archive_object = google_storage_bucket_object.archive-get.name
  trigger_http          = true
  entry_point           = "get"
  environment_variables = {
    TABLE_NAME = var.table_name
  }
}

# IAM entry for all users to invoke the function
resource "google_cloudfunctions_function_iam_member" "invoker-get" {
  project        = google_cloudfunctions_function.function-get.project
  region         = google_cloudfunctions_function.function-get.region
  cloud_function = google_cloudfunctions_function.function-get.name

  role   = "roles/cloudfunctions.invoker"
  member = "allUsers"
}