output "orama_gcp_post_url" {
  value = "http://${google_compute_instance.default.*.network_interface.0.access_config.0.nat_ip[0]}:3000"
}