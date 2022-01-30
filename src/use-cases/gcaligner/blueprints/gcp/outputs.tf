output "orama_gcp_put_url" {
  value = "http://${google_compute_instance.default.*.network_interface.0.access_config.0.nat_ip[0]}:8000/${var.instancetype}"
}