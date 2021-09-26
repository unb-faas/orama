output "orama_gcp_get_url" {
  value = google_cloudfunctions_function.function-get.https_trigger_url
}