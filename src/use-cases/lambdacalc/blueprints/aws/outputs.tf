output "orama_aws_get_url" {
  value = aws_api_gateway_deployment.get-deploy.invoke_url
}