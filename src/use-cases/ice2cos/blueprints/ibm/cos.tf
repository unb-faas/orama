resource "ibm_resource_instance" "cos_instance" {
  name              = "orama-${var.USECASE}-cos-${random_string.random.result}"
  service           = "cloud-object-storage"
  plan              = "standard"
  location          = "global"
  resource_group_id = ibm_resource_group.orama_rg.id
}

resource "ibm_cos_bucket" "cos_bucket" {
  bucket_name          = "orama-${var.USECASE}-bucket-${random_string.random.result}"
  resource_instance_id = ibm_resource_instance.cos_instance.id
  region_location      = var.region
  storage_class        = "smart"
}

resource "ibm_resource_key" "cos_credentials" {
  name                 = "orama-${var.USECASE}-cred-${random_string.random.result}"
  role                 = "Writer"
  resource_instance_id = ibm_resource_instance.cos_instance.id
}