output "orama_aws_put_url" {
  value = "http://${aws_instance.machine.*.public_ip[0]}:8000/${var.instancetype}"
}