output "orama_ali_get_url" {
  value = "${alicloud_api_gateway_api.apiGatewayApi.request_config[0].protocol}://${alicloud_api_gateway_group.apiGroup.sub_domain}${alicloud_api_gateway_api.apiGatewayApi.request_config[0].path}"
}