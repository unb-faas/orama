resource "google_firestore_index" "index" {

  collection = "orama${var.USECASE}tb${random_string.random.result}"

  fields {
    field_path = "name"
    order      = "ASCENDING"
  }

  fields {
    field_path = "description"
    order      = "DESCENDING"
  }

}