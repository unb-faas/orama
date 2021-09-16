output "faas_gcp_get_url" {
  value = google_cloudfunctions_function.function-get.https_trigger_url
}

output "faas_gcp_post_url" {
  value = google_cloudfunctions_function.function-post.https_trigger_url
}

output "faas_gcp_delete_url" {
  value = google_cloudfunctions_function.function-delete.https_trigger_url
}