output "orama_gcp_put_url" {
  value = google_cloudfunctions_function.function-put.https_trigger_url
}