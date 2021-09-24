resource "aws_dynamodb_table" "ddbtable" {
  name             = "tb${random_string.random.result}"
  hash_key         = "id"
  billing_mode   = "PROVISIONED"
  read_capacity  = 5
  write_capacity = 5
  attribute {
    name = "id"
    type = "N"
  }
}