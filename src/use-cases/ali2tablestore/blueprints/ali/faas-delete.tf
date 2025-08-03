resource "alicloud_oss_bucket_object" "default-delete" {
  bucket = alicloud_oss_bucket.default.id
  key    = "delete.zip"
  source = var.funcdelete
}


resource "alicloud_fc_function" "function-delete" {
  service     = alicloud_fc_service.default.name
  name        = "${var.funcname}-delete-${random_string.random.result}"
  description = "Orama Framework delete function"
  oss_bucket  = alicloud_oss_bucket.default.id
  oss_key     = alicloud_oss_bucket_object.default-delete.key
  memory_size = var.memory
  runtime     = "nodejs18"
  handler     = "index.delete"
  environment_variables = {
    ALICLOUD_ACCESS_KEY = var.ALICLOUD_ACCESS_KEY,
    ALICLOUD_SECRET_KEY = var.ALICLOUD_SECRET_KEY,
    TABLE_NAME = alicloud_ots_table.default.table_name,
    ENDPOINT = "https://${alicloud_ots_table.default.instance_name}.${var.region}.${var.tablestore_host}",
    INSTANCENAME = alicloud_ots_table.default.instance_name
  }
}


resource "alicloud_fc_trigger" "default-delete" {
  service  = alicloud_fc_service.default.name
  function = alicloud_fc_function.function-delete.name
  name     = alicloud_fc_function.function-delete.name
  role     = alicloud_ram_role.default.arn
  type     = "http"
  config   = <<EOF
       {
          "authType": "anonymous",
          "methods" : ["GET","DELETE"]
      }
   EOF
}
