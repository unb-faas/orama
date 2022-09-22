resource "aws_security_group" "allow_http" {
  name        = "allow_http_${random_string.random.result}"
  description = "Allow http inbound traffic"
  vpc_id = aws_vpc.main.id

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port       = 0
    to_port         = 0
    protocol        = "-1"
    cidr_blocks     = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "allow_ssh" {
  name        = "allow_ssh_${random_string.random.result}"
  description = "Allow ssh inbound traffic"
  vpc_id = aws_vpc.main.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_network_interface_sg_attachment" "sg_attachment" {
  security_group_id    = aws_security_group.allow_http.id
  network_interface_id = aws_instance.machine.primary_network_interface_id
}

resource "aws_network_interface_sg_attachment" "sg_attachment_ssh" {
  security_group_id    = aws_security_group.allow_ssh.id
  network_interface_id = aws_instance.machine.primary_network_interface_id
}