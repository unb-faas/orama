resource "google_compute_firewall" "rules" {
  name        = "orama-${var.USECASE}-${random_string.random.result}"
  network     = "default"
  description = "orama-${var.USECASE}-${random_string.random.result} allow port 8000"

  allow {
    protocol  = "tcp"
    ports     = ["8000"]
  }
  target_tags = ["orama-${var.USECASE}-${random_string.random.result}"]
  source_ranges = ["0.0.0.0/0"]
}
