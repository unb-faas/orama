output "orama_aws_put_url" {
  value = aws_api_gateway_deployment.put-deploy.invoke_url
}