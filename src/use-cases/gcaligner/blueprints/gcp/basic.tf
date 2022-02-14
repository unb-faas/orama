resource "random_string" "random" {
  length           = 4
  special          = false
  upper            = false
  override_special = "/@£$"
}

locals {
  cert = file(var.GCP_JSON_FILE)
}


resource "google_compute_instance" "default" {
  name         = "orama-${var.USECASE}-${random_string.random.result}"
  machine_type = var.instancetype
  zone         = var.zone

  boot_disk {
    initialize_params {
      image = var.image
    }
  }

  tags = ["orama-${var.USECASE}-${random_string.random.result}"]

  network_interface {
    network = "default"

    access_config {
      // Ephemeral public IP
    }
  }

  metadata_startup_script = <<-EOF
              #!/bin/bash
              apt-get install -y git python3-pip
              python3 -m venv .venv
              pip3 install fastapi psutil google google-cloud google-cloud-storage 
              pip3 install --upgrade google-api-python-client
              pip3 install uvicorn
              source .venv/bin/activate
              mkdir -p /app
              cd /app
              git clone https://github.com/unb-faas/sequence_comparison_app.git
              cd /app/sequence_comparison_app/algorithms/hirschberg/Python/iaas/gcp/
              echo '${local.cert}' > gcp.json
              sed -i "s/\/localhost/\/${var.instancetype}/" main.py
              cp /usr/local/bin/uvicorn /usr/bin/uvicorn
              ./start.sh &
            EOF
}