resource "aws_s3_bucket_object" "put-object" {
  bucket = aws_s3_bucket.bkt.id
  key    = "put.zip"
  source = var.func
  depends_on = [
      aws_s3_bucket.bkt
  ]
}

resource "aws_lambda_function" "put-faas" { 
  function_name = "orama-${var.USECASE}-put-${random_string.random.result}"
  s3_bucket     = aws_s3_bucket.bkt.id
  s3_key        = "put.zip"
  role          = aws_iam_role.orama.arn
  runtime       = "python3.8"
  timeout       = 900
  handler       = "main.align"
  memory_size   = var.memory
  
   depends_on = [
      aws_s3_bucket_object.put-object
  ]
}

resource "aws_api_gateway_integration" "put-lambda" {
  rest_api_id             = aws_api_gateway_rest_api.put-rest-api.id
  resource_id             = aws_api_gateway_method.put-proxy-method.resource_id
  http_method             = aws_api_gateway_method.put-proxy-method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.put-faas.invoke_arn
}

resource "aws_api_gateway_integration" "put-lambda_root" {
  rest_api_id             = aws_api_gateway_rest_api.put-rest-api.id
  resource_id             = aws_api_gateway_method.put-proxy-method-root.resource_id
  http_method             = aws_api_gateway_method.put-proxy-method-root.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.put-faas.invoke_arn
}

resource "aws_lambda_permission" "put-allow-apigateway" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.put-faas.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.put-rest-api.execution_arn}/*/*"
}

resource "aws_lambda_permission" "put-allow-cloudwatch" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:BasicExecution"
  function_name = aws_lambda_function.put-faas.function_name
  principal     = "events.amazonaws.com"
  source_arn    = "arn:aws:events:${var.region}:111122223333:rule/RunDaily"
  qualifier     = aws_lambda_alias.put-alias.name
}

resource "aws_lambda_alias" "put-alias" {
  name             = "put-alias"
  description      = "Alias to put function"
  function_name    = aws_lambda_function.put-faas.function_name
  function_version = "$LATEST"
}

resource "aws_api_gateway_rest_api" "put-rest-api" {
  name        = "orama-rest-api"
  description = "REST API for Orama Framework (autocreated)"
}

resource "aws_api_gateway_resource" "put-proxy-resource" {
  rest_api_id = aws_api_gateway_rest_api.put-rest-api.id
  parent_id   = aws_api_gateway_rest_api.put-rest-api.root_resource_id
  path_part   = "{proxy+}"
}

resource "aws_api_gateway_method" "put-proxy-method" {
  rest_api_id   = aws_api_gateway_rest_api.put-rest-api.id
  resource_id   = aws_api_gateway_resource.put-proxy-resource.id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "put-proxy-method-root" {
  rest_api_id   = aws_api_gateway_rest_api.put-rest-api.id
  resource_id   = aws_api_gateway_rest_api.put-rest-api.root_resource_id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_deployment" "put-deploy" {
  depends_on = [
    aws_api_gateway_integration.put-lambda,
    aws_api_gateway_integration.put-lambda_root,
  ]

  rest_api_id = aws_api_gateway_rest_api.put-rest-api.id
  stage_name  = "orama-put"
}
