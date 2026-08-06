resource "ibm_code_engine_function" "delete_faas" {
  project_id              = ibm_code_engine_project.orama_proj.id
  name                    = "orama-${var.USECASE}-delete-${random_string.random.result}"
  runtime                 = "nodejs-22"
  code_main               = "main"
  managed_domain_mappings = "local_public"

  code_reference = "data:text/javascript;base64,${base64encode(replace(replace(replace(replace(file("${path.module}/../../faas/ibm/delete/index.js"), "XXX_APIKEY_XXX", ibm_resource_key.cos_credentials.credentials["apikey"]), "XXX_RESOURCE_INSTANCE_ID_XXX", ibm_resource_key.cos_credentials.credentials["resource_instance_id"]), "XXX_BUCKET_XXX", ibm_cos_bucket.cos_bucket.bucket_name), "XXX_REGION_XXX", var.region))}"
  code_binary    = false

  scale_cpu_limit          = "0.25"
  scale_memory_limit       = "${var.memory}G"
  scale_max_execution_time = 60

  depends_on = [ibm_cos_bucket.cos_bucket]
}
