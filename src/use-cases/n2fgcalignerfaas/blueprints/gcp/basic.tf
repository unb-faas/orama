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

  provisioner "file" {
    source      = var.GCP_JSON_FILE
    destination = "/tmp/gcp.json"
    connection {
      host = google_compute_instance.default.*.network_interface.0.access_config.0.nat_ip[0]
      user = "provisioner"
      private_key = file("privKey.pem")
    }
   
  }

  metadata = {
    ssh-keys = "provisioner:${var.public_key}"
  }

  metadata_startup_script = <<-EOF
              #!/bin/bash
              curl -sL https://deb.nodesource.com/setup_14.x | sudo bash -
              apt-get update
              sudo apt -y install nodejs git unzip
              sudo npm i terraform-latest
              npm i -g node2faas
              mkdir ~/.node2faas/
              printf "gcp" >> ~/.node2faas/provider
              mkdir ~/.gcp
              echo "[default]" > ~/.gcp/credentials
              echo "json_file =  gcp.json" >> ~/.gcp/credentials
              printf "${var.region}" >> ~/.gcp/region
              ln -s /usr/bin/node /usr/local/bin/node
              cd /root/
              git clone https://github.com/node2faas/alignment.git
              mv /tmp/gcp.json /root
              source ~/.profile 
              node2faas --verbose --target alignment 2>&1 | tee result.txt
              cd output/alignment
              npm i
              npm start & 
            EOF
}