exports.seed = async function (knex, Promise) {
  let now = new Date().toISOString();
  await knex("tb_usecase")
    .then(function () {
      // Inserts seed entries
      return knex("tb_usecase").insert([
        {     
          id: 1,
          name: "AWS Lambda as backend to DynamoDB",
          acronym: "lambda2dynamodb",
          active: 1,
          id_provider: 1,
          provisionable: 1
        },
        
        {     
          id: 3,
          name: "AWS Lambda as backend to S3",
          acronym: "lambda2s3",
          active: 1,
          id_provider: 1,
          provisionable: 1
        },
       
        {     
          id: 5,
          name: "Lambda Calculator US-east",
          acronym: "lambdacalc",
          active: 1,
          id_provider:1,
          provisionable: 1,
          parameters:{
            region: "us-east-1"
          }
        },
             
        
        {     
          id: 7,
          name: "AWS EC2 t4g.xlarge (arm 16gb 4vcpu) with sequence aligner ",
          acronym: "ec2aligner",
          active: 1,
          id_provider:1,
          provisionable: 1,
          parameters:{
            instancetype: "t4g.xlarge",
            ami: "ami-0f6ef8dcbf23a4dc1",
            region: "us-east-1"
          }
        },
        {     
          id: 8,
          name: "AWS EC2 c6g.2xlarge (arm 16gb 8vcpu) with sequence aligner ",
          acronym: "ec2aligner",
          active: 1,
          id_provider:1,
          provisionable: 1,
          parameters:{
            instancetype: "c6g.2xlarge",
            ami: "ami-0f6ef8dcbf23a4dc1",
            region: "us-east-1"
          }
        },
        {     
          id: 9,
          name: "AWS EC2 c6g.4xlarge (arm 32gb 16vcpu) with sequence aligner ",
          acronym: "ec2aligner",
          active: 1,
          id_provider:1,
          provisionable: 1,
          parameters:{
            instancetype: "c6g.4xlarge",
            ami: "ami-0f6ef8dcbf23a4dc1",
            region: "us-east-1"
          }
        },
        {     
          id: 10,
          name: "AWS EC2 c6g.8xlarge (arm 64gb 32vcpu) with sequence aligner ",
          acronym: "ec2aligner",
          active: 1,
          id_provider:1,
          provisionable: 1,
          parameters:{
            instancetype: "c6g.8xlarge",
            ami: "ami-0f6ef8dcbf23a4dc1",
            region: "us-east-1"
          }
        },
        {     
          id: 11,
          name: "AWS EC2 t3a.xlarge (x86 16gb 4vcpu) with sequence aligner ",
          acronym: "ec2aligner",
          active: 1,
          id_provider:1,
          provisionable: 1,
          parameters:{
            instancetype: "t3a.xlarge",
            ami: "ami-01893222c83843146",
            region: "us-east-1"
          }
        },
        {     
          id: 12,
          name: "AWS EC2 c5a.2xlarge (x86 16gb 8vcpu) with sequence aligner ",
          acronym: "ec2aligner",
          active: 1,
          id_provider:1,
          provisionable: 1,
          parameters:{
            instancetype: "c5a.2xlarge",
            ami: "ami-01893222c83843146",
            region: "us-east-1"
          }
        },
        {     
          id: 13,
          name: "AWS EC2 c5a.4xlarge (x86 32gb 16vcpu) with sequence aligner ",
          acronym: "ec2aligner",
          active: 1,
          id_provider:1,
          provisionable: 1,
          parameters:{
            instancetype: "c5a.4xlarge",
            ami: "ami-01893222c83843146",
            region: "us-east-1"
          }
        },
        {     
          id: 14,
          name: "AWS EC2 c5a.8xlarge (x86 64gb 32vcpu) with sequence aligner ",
          acronym: "ec2aligner",
          active: 1,
          id_provider:1,
          provisionable: 1,
          parameters:{
            instancetype: "c5a.8xlarge",
            ami: "ami-01893222c83843146",
            region: "us-east-1"
          }
        },
        {     
          id: 15,
          name: "AWS Lambda (512mb) with sequence aligner",
          acronym: "lambdaaligner",
          active: 1,
          id_provider:1,
          provisionable: 1,
          parameters:{memory:512}
        },
        {     
          id: 16,
          name: "AWS Lambda (1024mb) with sequence aligner",
          acronym: "lambdaaligner",
          active: 1,
          id_provider:1,
          provisionable: 1,
          parameters:{memory:1024}
        },
        {     
          id: 17,
          name: "AWS Lambda (1536mb) with sequence aligner",
          acronym: "lambdaaligner",
          active: 1,
          id_provider:1,
          provisionable: 1,
          parameters:{memory:1536}
        },
        {     
          id: 18,
          name: "AWS Lambda (2048mb) with sequence aligner",
          acronym: "lambdaaligner",
          active: 1,
          id_provider:1,
          provisionable: 1,
          parameters:{memory:2048}
        },
        {     
          id: 19,
          name: "AWS Lambda (2560mb) with sequence aligner",
          acronym: "lambdaaligner",
          active: 1,
          id_provider:1,
          provisionable: 1,
          parameters:{memory:2560}
        },
        {     
          id: 20,
          name: "AWS Lambda (3072mb) with sequence aligner",
          acronym: "lambdaaligner",
          active: 1,
          id_provider:1,
          provisionable: 1,
          parameters:{memory:3072}
        },
        
        {     
          id: 37,
          name: "AWS EC2 t3a.xlarge with sequence aligner for node2faas ",
          acronym: "n2fec2alignernofaas",
          active: 1,
          id_provider:1,
          provisionable: 1,
          parameters:{
            instancetype: "t3a.xlarge",
            ami: "ami-01893222c83843146",
            region: "us-east-1"
          }
        },
        {     
          id: 38,
          name: "AWS EC2 t3a.xlarge with sequence aligner converted by node2faas ",
          acronym: "n2fec2alignerfaas",
          active: 1,
          id_provider:1,
          provisionable: 1,
          parameters:{
            instancetype: "t3a.xlarge",
            ami: "ami-01893222c83843146",
            region: "us-east-1"
          }
        },
        
        {     
          id: 45,
          name: "Lambda Calculator US-west",
          acronym: "lambdacalc",
          active: 1,
          id_provider:1,
          provisionable: 1,
          parameters:{
            region: "us-west-1"
          }
        },
        
        {     
          id: 49,
          name: "Lambda Calculator Frankfurt",
          acronym: "lambdacalc",
          active: 1,
          id_provider:1,
          provisionable: 1,
          parameters:{
            region: "eu-central-1"
          }
        },
        
        {     
          id: 53,
          name: "Lambda Calculator Hong Kong",
          acronym: "lambdacalc",
          active: 1,
          id_provider:1,
          provisionable: 1,
          parameters:{
            region: "ap-east-1"
          }
        },
        {     
          id: 57,
          name: "Lambda Calculator Australia",
          acronym: "lambdacalc",
          active: 1,
          id_provider:1,
          provisionable: 1,
          parameters:{
            region: "ap-southeast-2"
          }
        },
      ]);
    });
  };
