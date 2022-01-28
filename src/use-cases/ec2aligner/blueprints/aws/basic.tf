resource "random_string" "random" {
  length           = 4
  special          = false
  upper            = false
  override_special = "/@£$"
}

resource "aws_key_pair" "deployer" {
  key_name   = random_string.random.result
  public_key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDJTNheRcHkQfiXTN6DDtUGKxnfbmtLHGTZDmX9PJkFgZNXM4xxvPQd8mk0lZ4gXKwBVSdv5oAAf50f7YxePp5rL/17nAItQvvZw0KKYWFMhr448c2FGwVMDpkyEHBUEFuV9wMnndaNn4Hnq5EKbQ2LrpVXiPuaIeSSUrlLqvK4eCHUuq2ceD6Nn1NjB3zoJLqclJIk4cdGiZPywjSW2A2TJtDKc1WcgAw9pbHSfdHuR1LXB0mMfxiHGpV6+Sdbq6I65oK7jneLWwEZmAql83Wf9wXfc4gX+Z3ixw9TOj+qwaJAXv6kpxG7DoC6sqY7MSht17NNn9thZsF7fRmCIQ2+2xLrKv9RiaMhIBx1L2Oy44gpX0N+NlvjL+BwsG9WxzKKwu44gQfdjEH69bCNKGT+MHYhQLPdExpL748tjRg2u+VYsGNEn7jwvsjl+00uzM00mOAvJI1UdRPkrUbMuLZdQmff+oyv1cb6s/dpXuUp4vihtPVE7OegJgXY85fWHyE= machine@avell"
}

resource "aws_instance" "machine" {
  ami          = var.ami
  instance_type = var.instancetype
  key_name      = aws_key_pair.deployer.key_name
  tags = {
    Name = "orama-${var.USECASE}-${random_string.random.result}"
  }

  user_data = <<-EOF
              #!/bin/bash
              yum install git python3 gcc python3-devel aws-cli -y
              python3 -m venv .venv
              pip3 install fastapi psutil boto3
              pip3 install uvicorn[standard]
              source .venv/bin/activate
              mkdir ~/.aws
              echo "[default]" > ~/.aws/credentials
              echo "aws_access_key_id = " ${var.AWS_ACCESS_KEY_ID} >> ~/.aws/credentials
              echo "aws_secret_access_key = ${var.AWS_SECRET_ACCESS_KEY}" >> ~/.aws/credentials
              mkdir -p /app
              cd /app
              git clone https://github.com/unb-faas/sequence_comparison_app.git
              cd /app/sequence_comparison_app/algorithms/hirschberg/Python/app/
              sed -i "s/\/localhost/\/${var.instancetype}/" main.py
              cp /usr/local/bin/uvicorn /usr/bin/uvicorn
              ./start.sh &
            EOF 
}

resource "aws_network_interface_sg_attachment" "sg_attachment" {
  security_group_id    = aws_security_group.allow_http.id
  network_interface_id = aws_instance.machine.primary_network_interface_id
}

resource "aws_network_interface_sg_attachment" "sg_attachment_ssh" {
  security_group_id    = aws_security_group.allow_ssh.id
  network_interface_id = aws_instance.machine.primary_network_interface_id
}