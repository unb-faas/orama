resource "random_string" "random" {
  length           = 4
  special          = false
  upper            = false
  override_special = "/@£$"
}

resource "aws_s3_bucket" "bkt" {
  bucket = "orama-${random_string.random.result}"
  acl    = "private"

  tags = {
    Name        = "orama"
    Environment = "orama"
  }
}

resource "aws_iam_role" "orama" {
  name = "orama-${random_string.random.result}"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_policy" "basic-lambda-policy" {
  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ],
            "Resource": "*"
        },
        {
          "Effect": "Allow",
            "Action": [
                "s3:*"
            ],
          "Resource": "arn:aws:s3:::*"
        }
    ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "iam-role-policy" {
  role       = aws_iam_role.orama.name
  policy_arn = aws_iam_policy.basic-lambda-policy.arn
  depends_on = [
    aws_iam_role.orama,
    aws_iam_policy.basic-lambda-policy
  ]
}