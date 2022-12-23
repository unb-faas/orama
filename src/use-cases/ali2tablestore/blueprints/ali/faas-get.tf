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
    ALICLOUD_ACCESS_KEY = var.ALICLOUD_ACCESS_KEY,
    ALICLOUD_SECRET_KEY = var.ALICLOUD_SECRET_KEY,
    TABLE_NAME = alicloud_ots_table.default.table_name,
    ENDPOINT = "https://${alicloud_ots_table.default.instance_name}.${var.region}.${var.tablestore_host}",
    INSTANCENAME = alicloud_ots_table.default.instance_name
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
