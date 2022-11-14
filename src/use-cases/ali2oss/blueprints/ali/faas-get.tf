resource "alicloud_fc_service" "default" {
  name        = "${var.funcname}-${random_string.random.result}"
  description = ""
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


resource "alicloud_oss_bucket_object" "default-get" {
  bucket = alicloud_oss_bucket.default.id
  key    = "get.zip"
  source = var.funcget
}


resource "alicloud_fc_function" "function-get" {
  service     = alicloud_fc_service.default.name
  name        = "${var.funcname}-get-${random_string.random.result}"
  oss_bucket  = alicloud_oss_bucket.default.id
  oss_key     = alicloud_oss_bucket_object.default-get.key
  memory_size = var.memory
  runtime     = "nodejs12"
  handler     = "index.get"
  environment_variables = {
    MAIN_BUCKET = "${var.funcname}-${random_string.random.result}",
    ALICLOUD_ACCESS_KEY = var.ALICLOUD_ACCESS_KEY,
    ALICLOUD_SECRET_KEY = var.ALICLOUD_SECRET_KEY,
    REGION = var.region
  }
}


resource "alicloud_fc_trigger" "default-get" {
  service  = alicloud_fc_service.default.name
  function = alicloud_fc_function.function-get.name
  name     = alicloud_fc_function.function-get.name
  role     = alicloud_ram_role.default.arn
  type     = "http"
  config   = <<EOF
       {
          "authType": "anonymous",
          "methods" : ["GET"]
      }
   EOF
}
