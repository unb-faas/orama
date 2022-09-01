output "orama_aws_post_url" {
  value = "http://${aws_instance.machine.*.public_ip[0]}:3000"
}