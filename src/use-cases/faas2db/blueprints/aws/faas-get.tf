resource "aws_s3_bucket_object" "get-object" {
  bucket = aws_s3_bucket.bkt.id
  key    = "get.zip"
  source = "../../faas/aws/get/get.zip"
  depends_on = [
      aws_s3_bucket.bkt
  ]
}

resource "aws_lambda_function" "get-faas" { 
  function_name = "faas-evaluation-get"
  s3_bucket     = aws_s3_bucket.bkt.id
  s3_key        = "get.zip"
  role          = aws_iam_role.faas-evaluation.arn
  handler       = "index.handler"
  runtime       = "nodejs12.x"
  environment {
    variables = {
        TABLE_NAME = "covid19",
        LIMIT = 300
    }
  }
   depends_on = [
      aws_s3_bucket_object.get-object
  ]
}

resource "aws_api_gateway_integration" "get-lambda" {
  rest_api_id             = aws_api_gateway_rest_api.get-rest-api.id
  resource_id             = aws_api_gateway_method.get-proxy-method.resource_id
  http_method             = aws_api_gateway_method.get-proxy-method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.get-faas.invoke_arn
}

resource "aws_api_gateway_integration" "get-lambda_root" {
  rest_api_id             = aws_api_gateway_rest_api.get-rest-api.id
  resource_id             = aws_api_gateway_method.get-proxy-method-root.resource_id
  http_method             = aws_api_gateway_method.get-proxy-method-root.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.get-faas.invoke_arn
}

resource "aws_lambda_permission" "get-allow-apigateway" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get-faas.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.get-rest-api.execution_arn}/*/*"
}

resource "aws_lambda_permission" "get-allow-dynamodb" {
  statement_id  = "AllowDynamoDBInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get-faas.function_name
  principal     = "dynamodb.amazonaws.com"
  source_arn    = "${aws_dynamodb_table.ddbtable.arn}/*/*"
}

resource "aws_lambda_permission" "get-allow-cloudwatch" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:BasicExecution"
  function_name = aws_lambda_function.get-faas.function_name
  principal     = "events.amazonaws.com"
  source_arn    = "arn:aws:events:${var.region}:111122223333:rule/RunDaily"
  qualifier     = aws_lambda_alias.get-alias.name
}

resource "aws_lambda_alias" "get-alias" {
  name             = "get-alias"
  description      = "Alias to get function"
  function_name    = aws_lambda_function.get-faas.function_name
  function_version = "$LATEST"
}

resource "aws_api_gateway_rest_api" "get-rest-api" {
  name        = "evaluation-rest-api"
  description = "REST API for FaaS evaluation automaticly created"
}

resource "aws_api_gateway_resource" "get-proxy-resource" {
  rest_api_id = aws_api_gateway_rest_api.get-rest-api.id
  parent_id   = aws_api_gateway_rest_api.get-rest-api.root_resource_id
  path_part   = "{proxy+}"
}

resource "aws_api_gateway_method" "get-proxy-method" {
  rest_api_id   = aws_api_gateway_rest_api.get-rest-api.id
  resource_id   = aws_api_gateway_resource.get-proxy-resource.id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "get-proxy-method-root" {
  rest_api_id   = aws_api_gateway_rest_api.get-rest-api.id
  resource_id   = aws_api_gateway_rest_api.get-rest-api.root_resource_id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_deployment" "get-deploy" {
  depends_on = [
    aws_api_gateway_integration.get-lambda,
    aws_api_gateway_integration.get-lambda_root,
  ]

  rest_api_id = aws_api_gateway_rest_api.get-rest-api.id
  stage_name  = "faas-evaluation-get"
}

output "faas_aws_get_url" {
  value = aws_api_gateway_deployment.get-deploy.invoke_url
}