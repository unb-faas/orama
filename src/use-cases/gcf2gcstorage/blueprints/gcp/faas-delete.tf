resource "google_storage_bucket" "bucket-delete" {
  name = "orama-${var.USECASE}-delete-${random_string.random.result}"
  location      = "US"
}

resource "google_storage_bucket_object" "archive-delete" {
  name   = "delete.zip"
  bucket = google_storage_bucket.bucket-delete.name
  source = var.funcdelete
}

resource "google_cloudfunctions_function" "function-delete" {
  name        = "orama-${var.USECASE}-delete-${random_string.random.result}"
  description = "Orama Framework delete function"
  runtime     = "nodejs12"
  available_memory_mb   = var.memory
  max_instances         = var.max_instances
  source_archive_bucket = google_storage_bucket.bucket-delete.name
  source_archive_object = google_storage_bucket_object.archive-delete.name
  trigger_http          = true
  entry_point           = "del"
  environment_variables = {
    MAIN_BUCKET = "orama${var.USECASE}${random_string.random.result}"
  }
}

resource "google_cloudfunctions_function_iam_member" "invoker-delete" {
  project        = google_cloudfunctions_function.function-delete.project
  region         = google_cloudfunctions_function.function-delete.region
  cloud_function = google_cloudfunctions_function.function-delete.name

  role   = "roles/cloudfunctions.invoker"
  member = "allUsers"
}
