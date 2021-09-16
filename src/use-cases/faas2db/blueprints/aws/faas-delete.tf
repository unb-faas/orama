resource "aws_s3_bucket_object" "delete-object" {
  bucket = aws_s3_bucket.bkt.id
  key    = "delete.zip"
  source = "../../faas/aws/delete/delete.zip"
  depends_on = [
      aws_s3_bucket.bkt
  ]
}

resource "aws_lambda_function" "delete-faas" { 
  function_name = "faas-evaluation-delete"
  s3_bucket     = aws_s3_bucket.bkt.id
  s3_key        = "delete.zip"
  role          = aws_iam_role.faas-evaluation.arn
  handler       = "index.handler"
  runtime       = "nodejs12.x"
  environment {
    variables = {
        TABLE_NAME = "covid19",
        PK = "id"
    }
  }
   depends_on = [
      aws_s3_bucket_object.delete-object
  ]
}

resource "aws_api_gateway_integration" "delete-lambda" {
  rest_api_id             = aws_api_gateway_rest_api.delete-rest-api.id
  resource_id             = aws_api_gateway_method.delete-proxy-method.resource_id
  http_method             = aws_api_gateway_method.delete-proxy-method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.delete-faas.invoke_arn
}

resource "aws_api_gateway_integration" "delete-lambda_root" {
  rest_api_id             = aws_api_gateway_rest_api.delete-rest-api.id
  resource_id             = aws_api_gateway_method.delete-proxy-method-root.resource_id
  http_method             = aws_api_gateway_method.delete-proxy-method-root.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.delete-faas.invoke_arn
}

resource "aws_lambda_permission" "delete-allow-apigateway" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.delete-faas.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.delete-rest-api.execution_arn}/*/*"
}

resource "aws_lambda_permission" "delete-allow-dynamodb" {
  statement_id  = "AllowDynamoDBInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.delete-faas.function_name
  principal     = "dynamodb.amazonaws.com"
  source_arn    = "${aws_dynamodb_table.ddbtable.arn}/*/*"
}

resource "aws_lambda_permission" "delete-allow-cloudwatch" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:BasicExecution"
  function_name = aws_lambda_function.delete-faas.function_name
  principal     = "events.amazonaws.com"
  source_arn    = "arn:aws:events:${var.region}:111122223333:rule/RunDaily"
  qualifier     = aws_lambda_alias.delete-alias.name
}

resource "aws_lambda_alias" "delete-alias" {
  name             = "delete-alias"
  description      = "Alias to delete function"
  function_name    = aws_lambda_function.delete-faas.function_name
  function_version = "$LATEST"
}

resource "aws_api_gateway_rest_api" "delete-rest-api" {
  name        = "evaluation-rest-api"
  description = "REST API for FaaS evaluation automaticly created"
}

resource "aws_api_gateway_resource" "delete-proxy-resource" {
  rest_api_id = aws_api_gateway_rest_api.delete-rest-api.id
  parent_id   = aws_api_gateway_rest_api.delete-rest-api.root_resource_id
  path_part   = "{proxy+}"
}

resource "aws_api_gateway_method" "delete-proxy-method" {
  rest_api_id   = aws_api_gateway_rest_api.delete-rest-api.id
  resource_id   = aws_api_gateway_resource.delete-proxy-resource.id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "delete-proxy-method-root" {
  rest_api_id   = aws_api_gateway_rest_api.delete-rest-api.id
  resource_id   = aws_api_gateway_rest_api.delete-rest-api.root_resource_id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_deployment" "delete-deploy" {
  depends_on = [
    aws_api_gateway_integration.delete-lambda,
    aws_api_gateway_integration.delete-lambda_root,
  ]

  rest_api_id = aws_api_gateway_rest_api.delete-rest-api.id
  stage_name  = "faas-evaluation-delete"
}

output "faas_aws_delete_url" {
  value = aws_api_gateway_deployment.delete-deploy.invoke_url
}