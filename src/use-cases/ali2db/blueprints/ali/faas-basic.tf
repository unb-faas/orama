resource "random_string" "random" {
  length           = 4
  special          = false
  upper            = false
  override_special = "/@£$"
}


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


resource "alicloud_oss_bucket" "default" {
  bucket = "${var.funcname}-${random_string.random.result}"
}


resource "alicloud_log_project" "default" {
  name        = "${var.funcname}-${random_string.random.result}"
  description = ""
}


resource "alicloud_log_store" "default" {
  project          = alicloud_log_project.default.name
  name             = "${var.funcname}-${random_string.random.result}"
  retention_period = "3000"
  shard_count      = 1
}


resource "alicloud_log_store_index" "default" {
  project  = alicloud_log_project.default.name
  logstore = alicloud_log_store.default.name
  full_text {
    case_sensitive = false
    token          = "#$%^*\n\r"
  }
  field_search {
    name             = "terraform"
    enable_analytics = true
  }
}


resource "alicloud_ram_role" "default" {
  name        = "${var.funcname}-${random_string.random.result}"
  document    = <<EOF
{
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Effect": "Allow",
      "Principal": {
        "Service": [
          "log.aliyuncs.com",
          "fc.aliyuncs.com"
        ]
      }
    }
  ],
  "Version": "1"
}
EOF
  description = ""
  force       = true
}


resource "alicloud_ram_role_policy_attachment" "default" {
  role_name   = alicloud_ram_role.default.name
  policy_name = "AliyunLogFullAccess"
  policy_type = "System"
}
resource "alicloud_ram_role_policy_attachment" "defaultFCInvocationAccess" {
  role_name   = alicloud_ram_role.default.name
  policy_name = "AliyunFCInvocationAccess"
  policy_type = "System"
}
