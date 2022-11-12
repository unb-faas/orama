resource "random_string" "random" {
  length           = 4
  special          = false
  upper            = false
  override_special = "/@£$"
}


resource "alicloud_log_project" "default" {
  name        = var.funcname
  description = "tf unit test"
}


resource "alicloud_log_store" "default" {
  project          = alicloud_log_project.default.name
  name             = var.funcname
  retention_period = "3000"
  shard_count      = 1
}

   
resource "alicloud_log_store_index" "default" {
  project  = alicloud_log_project.default.name
  logstore = alicloud_log_store.default.name
  full_text {
    case_sensitive = true
    token          = " #$%^*\r\n    "
  }
  field_search {
    name             = "terraform"
    enable_analytics = true
  }
}


resource "alicloud_oss_bucket" "default" {
  bucket = var.funcname
}


resource "alicloud_ram_role" "default" {
  name        = "orama-${var.funcname}-${random_string.random.result}"
  document    = <<EOF
        {
          "Statement": [
            {
              "Action": "sts:AssumeRole",
              "Effect": "Allow",
              "Principal": {
                "Service": [
                  "fc.aliyuncs.com",
                  "apigateway.aliyuncs.com"
                ]
              }
            }
          ],
          "Version": "1"
        }

EOF
  description = "this is a test"
  force       = true
}


resource "alicloud_ram_role_policy_attachment" "default" {
  role_name   = alicloud_ram_role.default.name
  policy_name = "AliyunLogFullAccess"
  policy_type = "System"
}
resource "alicloud_ram_role_policy_attachment" "defaultApiGatewayFullAccess" {
  role_name   = alicloud_ram_role.default.name
  policy_name = "AliyunApiGatewayFullAccess"
  policy_type = "System"
}
resource "alicloud_ram_role_policy_attachment" "defaultFCInvocationAccess" {
  role_name   = alicloud_ram_role.default.name
  policy_name = "AliyunFCInvocationAccess"
  policy_type = "System"
}
