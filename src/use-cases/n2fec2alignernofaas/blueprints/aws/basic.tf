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

  subnet_id = aws_subnet.my_subnet.id

  user_data = <<-EOF
              #!/bin/bash
              yum install git gcc-c++ make -y
              curl -sL https://rpm.nodesource.com/setup_14.x | sudo -E bash - 
              yum install -y nodejs -y
              git clone https://github.com/node2faas/alignment.git
              cd alignment/
              npm i
              npm start &
            EOF 
}