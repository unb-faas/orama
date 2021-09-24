resource "google_firestore_index" "index" {

  collection = "oramatb${random_string.random.result}"

  fields {
    field_path = "name"
    order      = "ASCENDING"
  }

  fields {
    field_path = "description"
    order      = "DESCENDING"
  }

}