resource "google_firestore_index" "index" {

  collection = "tb${random_integer.ri.result}"

  fields {
    field_path = "name"
    order      = "ASCENDING"
  }

  fields {
    field_path = "description"
    order      = "DESCENDING"
  }

}