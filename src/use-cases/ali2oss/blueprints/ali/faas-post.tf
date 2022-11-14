resource "alicloud_oss_bucket_object" "default-post" {
  bucket = alicloud_oss_bucket.default.id
  key    = "post.zip"
  source = var.funcpost
}


resource "alicloud_fc_function" "function-post" {
  service     = alicloud_fc_service.default.name
  name        = "${var.funcname}-post-${random_string.random.result}"
  oss_bucket  = alicloud_oss_bucket.default.id
  oss_key     = alicloud_oss_bucket_object.default-post.key
  memory_size = var.memory
  runtime     = "nodejs12"
  handler     = "index.post"
  environment_variables = {
    MAIN_BUCKET = "${var.funcname}-${random_string.random.result}",
    ALICLOUD_ACCESS_KEY = var.ALICLOUD_ACCESS_KEY,
    ALICLOUD_SECRET_KEY = var.ALICLOUD_SECRET_KEY,
    REGION = var.region
  }
}


resource "alicloud_fc_trigger" "default-post" {
  service  = alicloud_fc_service.default.name
  function = alicloud_fc_function.function-post.name
  name     = alicloud_fc_function.function-post.name
  role     = alicloud_ram_role.default.arn
  type     = "http"
  config   = <<EOF
      {
          "authType": "anonymous",
          "methods" : ["GET"]
      }
   EOF
}
