resource "google_storage_bucket" "bucket-put" {
  name = "orama-${var.USECASE}-put-${random_string.random.result}"
  location      = "US"
}

resource "google_storage_bucket_object" "archive-put" {
  name   = "put.zip"
  bucket = google_storage_bucket.bucket-put.name
  source = var.funcput
}

resource "google_cloudfunctions_function" "function-put" {
  name        = "orama-${var.USECASE}-put-${random_string.random.result}"
  description = "Orama Framework put function"
  runtime     = "python39"
  available_memory_mb   = var.memory
  max_instances         = var.max_instances
  source_archive_bucket = google_storage_bucket.bucket-put.name
  source_archive_object = google_storage_bucket_object.archive-put.name
  trigger_http          = true
  entry_point           = "align"
  timeout               = 540
}

resource "google_cloudfunctions_function_iam_member" "invoker-put" {
  project        = google_cloudfunctions_function.function-put.project
  region         = google_cloudfunctions_function.function-put.region
  cloud_function = google_cloudfunctions_function.function-put.name

  role   = "roles/cloudfunctions.invoker"
  member = "allUsers"
}