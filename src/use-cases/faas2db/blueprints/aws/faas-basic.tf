resource "random_string" "random" {
  length           = 4
  special          = false
  upper            = false
  override_special = "/@£$"
}

resource "aws_s3_bucket" "bkt" {
  bucket = "unbfaas-${random_string.random.result}"
  acl    = "private"

  tags = {
    Name        = "faas-evaluation"
    Environment = "evaluation"
  }
}

resource "aws_iam_role" "faas-evaluation" {
  name = "faas-evaluation"

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
        }
    ]
}
EOF
}

resource "aws_iam_policy" "dynamodb-policy" {
  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:*"
            ],
            "Resource": "*"
        }
    ]
}
EOF
  depends_on = [
    aws_iam_role.faas-evaluation,
  ]
}

resource "aws_iam_role_policy_attachment" "iam-role-policy" {
  role       = aws_iam_role.faas-evaluation.name
  policy_arn = aws_iam_policy.basic-lambda-policy.arn
  depends_on = [
    aws_iam_role.faas-evaluation,
    aws_iam_policy.basic-lambda-policy
  ]
}

resource "aws_iam_role_policy_attachment" "dynamodb-policy" {
  role       = aws_iam_role.faas-evaluation.name
  policy_arn = aws_iam_policy.dynamodb-policy.arn
   depends_on = [
    aws_iam_role.faas-evaluation,
    aws_iam_policy.dynamodb-policy
  ]
}

