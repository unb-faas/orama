resource "alicloud_fc_service" "default" {
  name        = "${var.funcname}-${random_string.random.result}"
  description = "tf unit test"
  role        = alicloud_ram_role.default.arn
  depends_on = [
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
  name        = "${var.funcname}-${random_string.random.result}"
  oss_bucket  = alicloud_oss_bucket.default.id
  oss_key     = alicloud_oss_bucket_object.default.key
  memory_size = "128"
  runtime     = "nodejs12"
  handler     = "index.handler"
  environment_variables = {
    prefix = "terraform"
  }
}

resource "alicloud_fc_trigger" "default" {
  service  = alicloud_fc_service.default.name
  function = alicloud_fc_function.get-faas.name
  name     = "${var.funcname}-${random_string.random.result}"
  role     = alicloud_ram_role.default.arn
  type     = "http"
  config   = <<EOF
      {
          "authType": "anonymous",
          "methods" : ["GET"]
      }
   EOF
}

data "alicloud_fc_triggers" "fc_triggers_ds" {
  service_name  = alicloud_fc_service.default.name
  function_name =  alicloud_fc_function.get-faas.name
}