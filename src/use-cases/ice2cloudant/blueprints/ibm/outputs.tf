output "ibm_get_url" {
  value = ibm_code_engine_function.get-faas.endpoint
}

output "ibm_delete_url" {
  value = ibm_code_engine_function.delete-faas.endpoint
}

output "ibm_post_url" {
  value = ibm_code_engine_function.post-faas.endpoint
}