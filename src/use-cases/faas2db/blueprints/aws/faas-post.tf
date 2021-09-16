resource "aws_s3_bucket_object" "post-object" {
  bucket = aws_s3_bucket.bkt.id
  key    = "post.zip"
  source = "../../faas/aws/post/post.zip"
  depends_on = [
      aws_s3_bucket.bkt
  ]
}

resource "aws_lambda_function" "post-faas" { 
  function_name = "faas-evaluation-post"
  s3_bucket     = aws_s3_bucket.bkt.id
  s3_key        = "post.zip"
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
      aws_s3_bucket_object.post-object
  ]
}

resource "aws_api_gateway_integration" "post-lambda" {
  rest_api_id             = aws_api_gateway_rest_api.post-rest-api.id
  resource_id             = aws_api_gateway_method.post-proxy-method.resource_id
  http_method             = aws_api_gateway_method.post-proxy-method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.post-faas.invoke_arn
}

resource "aws_api_gateway_integration" "post-lambda_root" {
  rest_api_id             = aws_api_gateway_rest_api.post-rest-api.id
  resource_id             = aws_api_gateway_method.post-proxy-method-root.resource_id
  http_method             = aws_api_gateway_method.post-proxy-method-root.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.post-faas.invoke_arn
}

resource "aws_lambda_permission" "post-allow-apigateway" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.post-faas.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.post-rest-api.execution_arn}/*/*"
}

resource "aws_lambda_permission" "post-allow-dynamodb" {
  statement_id  = "AllowDynamoDBInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.post-faas.function_name
  principal     = "dynamodb.amazonaws.com"
  source_arn    = "${aws_dynamodb_table.ddbtable.arn}/*/*"
}

resource "aws_lambda_permission" "post-allow-cloudwatch" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:BasicExecution"
  function_name = aws_lambda_function.post-faas.function_name
  principal     = "events.amazonaws.com"
  source_arn    = "arn:aws:events:${var.region}:111122223333:rule/RunDaily"
  qualifier     = aws_lambda_alias.post-alias.name
}

resource "aws_lambda_alias" "post-alias" {
  name             = "post-alias"
  description      = "Alias to post function"
  function_name    = aws_lambda_function.post-faas.function_name
  function_version = "$LATEST"
}

resource "aws_api_gateway_rest_api" "post-rest-api" {
  name        = "evaluation-rest-api"
  description = "REST API for FaaS evaluation automaticly created"
}

resource "aws_api_gateway_resource" "post-proxy-resource" {
  rest_api_id = aws_api_gateway_rest_api.post-rest-api.id
  parent_id   = aws_api_gateway_rest_api.post-rest-api.root_resource_id
  path_part   = "{proxy+}"
}

resource "aws_api_gateway_method" "post-proxy-method" {
  rest_api_id   = aws_api_gateway_rest_api.post-rest-api.id
  resource_id   = aws_api_gateway_resource.post-proxy-resource.id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "post-proxy-method-root" {
  rest_api_id   = aws_api_gateway_rest_api.post-rest-api.id
  resource_id   = aws_api_gateway_rest_api.post-rest-api.root_resource_id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_deployment" "post-deploy" {
  depends_on = [
    aws_api_gateway_integration.post-lambda,
    aws_api_gateway_integration.post-lambda_root,
  ]

  rest_api_id = aws_api_gateway_rest_api.post-rest-api.id
  stage_name  = "faas-evaluation-post"
}

output "faas_aws_post_url" {
  value = aws_api_gateway_deployment.post-deploy.invoke_url
}