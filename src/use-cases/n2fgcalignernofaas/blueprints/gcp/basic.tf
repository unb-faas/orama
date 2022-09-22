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
              curl -sL https://deb.nodesource.com/setup_14.x | sudo bash -
              apt-get update
              sudo apt -y install nodejs git 
              git clone https://github.com/node2faas/alignment.git
              cd alignment/
              npm i
              npm start &
            EOF
}