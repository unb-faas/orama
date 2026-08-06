# Cria a instância do Cloudant
resource "ibm_cloudant" "cloudant_instance" {
  name              = "orama-${var.USECASE}-db-${random_string.random.result}"
  location          = var.region
  plan              = "lite"
  resource_group_id = ibm_resource_group.orama_rg.id
}

# Cria o db dentro da instância
resource "ibm_cloudant_database" "cloudant_db" {
  instance_crn = ibm_cloudant.cloudant_instance.crn
  db           = "orama-db"
}

# Criação das credenciais de acesso ao banco Cloudant
resource "ibm_resource_key" "cloudant_credentials" {
  name                 = "orama-${var.USECASE}-cred-${random_string.random.result}"
  role                 = "Manager"
  resource_instance_id = ibm_cloudant.cloudant_instance.id
}
