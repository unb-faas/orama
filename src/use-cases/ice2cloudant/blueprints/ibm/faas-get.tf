resource "ibm_code_engine_function" "get-faas" {
  project_id = ibm_code_engine_project.orama_proj.id
  name       = "orama-${var.USECASE}-get-${random_string.random.result}"
  runtime    = "nodejs-22"
  code_main  = "main" 
  managed_domain_mappings = "local_public"
  
  # Lê o arquivo como texto puro e substitui apenas as tags exatas
  code_reference = "data:text/javascript;base64,${base64encode(replace(replace(file("${path.module}/../../faas/ibm/get/index.js"), "XXX_URL_XXX", ibm_resource_key.cloudant_credentials.credentials["url"]), "XXX_APIKEY_XXX", ibm_resource_key.cloudant_credentials.credentials["apikey"]))}"
  code_binary    = false

  scale_cpu_limit          = "0.25"
  scale_memory_limit       = "${var.memory}G"
  scale_max_execution_time = 60
}