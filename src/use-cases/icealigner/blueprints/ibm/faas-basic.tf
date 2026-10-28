resource "random_string" "random" {
  length  = 4
  special = false
  upper   = false
}

resource "ibm_resource_group" "orama_rg" {
  name = "orama-${var.USECASE}-${random_string.random.result}-rg"
}

resource "ibm_code_engine_project" "orama_proj" {
  name              = "orama-${var.USECASE}-${random_string.random.result}-proj"
  resource_group_id = ibm_resource_group.orama_rg.id
}
