# output "orama_ali_get_url" {
#   //value = "${alicloud_api_gateway_api.apiGatewayApi.request_config[0].protocol}://${alicloud_api_gateway_group.apiGroup.sub_domain}${alicloud_api_gateway_api.apiGatewayApi.request_config[0].path}"
#     value = jsonencode(alicloud_fc_trigger.default)
# }

output "orama_ali_get_url" {
  value = jsonencode(data.alicloud_fc_triggers.fc_triggers_ds)//.0.name}"
}

output "teste" {
  value = jsonencode(alicloud_fc_function.get-faas)//.0.name}"
}
