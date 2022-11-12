resource "alicloud_fc_service" "default" {
  name        = var.funcname
  description = "tf unit test"
  role        = alicloud_ram_role.default.arn
  depends_on  = [
    alicloud_ram_role_policy_attachment.default,
    alicloud_log_project.default
  ]
  log_config {
    project  = alicloud_log_project.default.name
    logstore = alicloud_log_store.default.name
  }
}


resource "alicloud_oss_bucket_object" "default" {
  bucket = alicloud_oss_bucket.default.id
  key    = "get.zip"
  source = var.funcget
}


resource "alicloud_fc_function" "get-faas" {
  service     = alicloud_fc_service.default.name
  name        = "orama-${var.USECASE}-get-${random_string.random.result}"
  description = "tf"
  oss_bucket  = alicloud_oss_bucket.default.id
  oss_key     = alicloud_oss_bucket_object.default.key
  memory_size = "128"
  runtime     = "nodejs12"
  handler     = "index.handler"
  environment_variables = {
    prefix = "terraform"
  }
}


resource "alicloud_api_gateway_group" "apiGroup" {
  name        = "ApiGatewayGroup"
  description = "api group"
}


resource "alicloud_api_gateway_api" "apiGatewayApi" {
  name              = "apiGatewayApi"
  group_id          = alicloud_api_gateway_group.apiGroup.id
  description       = "api gateway"
  auth_type         = "ANONYMOUS"
  force_nonce_check = false
  service_type      = "FunctionCompute"
  request_config {
    protocol    = "HTTP"
    method      = "GET"
    path        = "/orama-get"
    mode        = "PASSTHROUGH"
  }
  fc_service_config {
    region        = var.region
    function_name = alicloud_fc_function.get-faas.name
    service_name  = alicloud_fc_service.default.name
    arn_role      = alicloud_fc_service.default.role
    timeout       = 3000
  }
  stage_names = [
    "RELEASE"
  ]
}
