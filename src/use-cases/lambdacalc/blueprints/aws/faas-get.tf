resource "aws_s3_bucket_object" "get-object" {
  bucket = aws_s3_bucket.bkt.id
  key    = "get.zip"
  source = var.funcget
  depends_on = [
      aws_s3_bucket.bkt
  ]
}

resource "aws_lambda_function" "get-faas" { 
  function_name = "orama-get-${random_string.random.result}"
  s3_bucket     = aws_s3_bucket.bkt.id
  s3_key        = "get.zip"
  role          = aws_iam_role.orama.arn
  handler       = "index.handler"
  runtime       = "nodejs12.x"
  memory_size   = var.memory
  environment {
    variables = {
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
  name        = "orama-rest-api"
  description = "REST API for Orama Framework (autocreated)"
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
  stage_name  = "orama-get"
}
