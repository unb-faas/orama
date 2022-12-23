resource "alicloud_ots_instance" "default" {
  name        = "${var.funcname}-${random_string.random.result}" # length: 3-16
  description = ""
  accessed_by = "Any" # "Vpc", "ConsoleOrVpc" or "Any" (default) 
  tags = {
    Created = "orama"
    For     = "orama"
  }
}

resource "alicloud_ots_table" "default" {
  instance_name = alicloud_ots_instance.default.name
  table_name    = "${var.funcname}_${random_string.random.result}" # length: 1-255
  primary_key {
    name   = "pk"
    type   = "Integer" # Integer, String or Binary
  }
  defined_column {
    name = "data"    # max: 32 chars
    type = "String" # Integer, String, Binary, Double, Boolean
  }

  time_to_live                  = -1                # never: -1; max: 2147483647
  max_version                   = 1                 # range: 1-2147483647
  deviation_cell_version_in_sec = 1                 # range: 1-9223372036854775807. default: 86400.
  # enable_sse                    = true              # default: false
  # sse_key_type                  = "SSE_KMS_SERVICE" # Only SSE_KMS_SERVICE
}

resource "alicloud_vpc" "default" {
  cidr_block = "172.16.0.0/16"
  vpc_name       = "${var.funcname}${random_string.random.result}"
}

data "alicloud_zones" "default" {
  available_resource_creation = "VSwitch"
}

resource "alicloud_vswitch" "default" {
  vpc_id       = alicloud_vpc.default.id
  vswitch_name = "${var.funcname}-${random_string.random.result}"
  cidr_block   = "172.16.1.0/24"
  zone_id      = data.alicloud_zones.default.zones[0].id
}

resource "alicloud_ots_instance_attachment" "default" {
  instance_name = alicloud_ots_instance.default.name
  vpc_name      = alicloud_vpc.default.vpc_name
  vswitch_id    = alicloud_vswitch.default.id
}
