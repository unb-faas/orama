resource "aws_s3_bucket" "main" {
  bucket = "oramatb${random_string.random.result}"
  acl    = "private"

  tags = {
    Name        = "orama"
    Environment = "orama"
  }
}