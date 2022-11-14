resource "alicloud_oss_bucket" "default" {
  bucket = "${var.funcname}-${random_string.random.result}"
}