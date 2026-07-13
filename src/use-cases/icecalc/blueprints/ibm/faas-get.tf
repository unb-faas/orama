# Bloco de compactação
data "archive_file" "function_zip" {
  type        = "zip"
  source_file = "${path.module}/../../faas/ibm/get/index.js"
  output_path = var.funcget
}

# A Função Serverless com o envio de zip
resource "ibm_code_engine_function" "get-faas" {
  project_id = ibm_code_engine_project.orama_proj.id
  name      = "orama-${var.USECASE}-get-${random_string.random.result}"
  runtime   = "nodejs-22"

  code_main = "main" 
  managed_domain_mappings = "local_public"

  # Envio do código binário para IBM
  code_reference = "data:application/zip;base64,${filebase64(data.archive_file.function_zip.output_path)}"
  code_binary    = true

  # Configuração de limites de memória e CPU
  scale_cpu_limit    = "0.25"
  scale_memory_limit = "${var.memory}G"

  scale_max_execution_time = 60
}