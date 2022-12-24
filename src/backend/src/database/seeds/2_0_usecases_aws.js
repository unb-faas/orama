exports.seed = async function (knex, Promise) {
  let now = new Date().toISOString();
  await knex("tb_usecase")
    .then(function () {
      // Inserts seed entries
      return knex("tb_usecase").insert([

        // Calculators
        
        {     
          id: 0,
          name: "Lambda Calc US-East",
          acronym: "lambdacalc",
          active: 1,
          id_provider:0,
          provisionable: 1,
          parameters:{
            region: "us-east-1"
          }
        },
        {     
          id: 1,
          name: "Lambda Calc US-West",
          acronym: "lambdacalc",
          active: 1,
          id_provider:0,
          provisionable: 1,
          parameters:{
            region: "us-west-1"
          }
        },
        {     
          id: 2,
          name: "Lambda Calc Europe",
          acronym: "lambdacalc",
          active: 1,
          id_provider:0,
          provisionable: 1,
          parameters:{
            region: "eu-central-1"
          }
        },
        
        {     
          id: 3,
          name: "Lambda Calc Asia",
          acronym: "lambdacalc",
          active: 1,
          id_provider:0,
          provisionable: 1,
          parameters:{
            region: "ap-east-1"
          }
        },
        {     
          id: 4,
          name: "Lambda Calc Australia",
          acronym: "lambdacalc",
          active: 1,
          id_provider:0,
          provisionable: 1,
          parameters:{
            region: "ap-southeast-2"
          }
        },

        // Databases


        {     
          id: 10,
          name: "Lambda for Database (DynamoDB) US-East",
          acronym: "lambda2dynamodb",
          active: 1,
          id_provider:0,
          provisionable: 1,
          parameters:{
            region: "us-east-1"
          }
        },

        {     
          id: 11,
          name: "Lambda for Database (DynamoDB) US-West",
          acronym: "lambda2dynamodb",
          active: 1,
          id_provider:0,
          provisionable: 1,
          parameters:{
            region: "us-west-1"
          }
        },

        {     
          id: 12,
          name: "Lambda for Database (DynamoDB) Europe",
          acronym: "lambda2dynamodb",
          active: 1,
          id_provider:0,
          provisionable: 1,
          parameters:{
            region: "eu-central-1"
          }
        },

        {     
          id: 13,
          name: "Lambda for Database (DynamoDB) Asia",
          acronym: "lambda2dynamodb",
          active: 1,
          id_provider:0,
          provisionable: 1,
          parameters:{
            region: "ap-east-1"
          }
        },

        {     
          id: 14,
          name: "Lambda for Database (DynamoDB) Australia",
          acronym: "lambda2dynamodb",
          active: 1,
          id_provider:0,
          provisionable: 1,
          parameters:{
            region: "ap-southeast-2"
          }
        },

        // Object Storages
        
        {     
          id: 20,
          name: "Lambda for Object Storage (S3) US-East",
          acronym: "lambda2s3",
          active: 1,
          id_provider:0,
          provisionable: 1,
          parameters:{
            region: "us-east-1"
          }
        },

        {     
          id: 21,
          name: "Lambda for Object Storage (S3) US-West",
          acronym: "lambda2s3",
          active: 1,
          id_provider:0,
          provisionable: 1,
          parameters:{
            region: "us-west-1"
          }
        },

        {     
          id: 22,
          name: "Lambda for Object Storage (S3) Europe",
          acronym: "lambda2s3",
          active: 1,
          id_provider:0,
          provisionable: 1,
          parameters:{
            region: "eu-central-1"
          }
        },

        {     
          id: 23,
          name: "Lambda for Object Storage (S3) Asia",
          acronym: "lambda2s3",
          active: 1,
          id_provider:0,
          provisionable: 1,
          parameters:{
            region: "ap-east-1"
          }
        },

        {     
          id: 24,
          name: "Lambda for Object Storage (S3) Australia",
          acronym: "lambda2s3",
          active: 1,
          id_provider:0,
          provisionable: 1,
          parameters:{
            region: "ap-southeast-2"
          }
        },
       
        // Sequence Aligner (VM) for AFMC framework    

        {     
          id: 84,
          name: "EC2 t4g.xlarge (arm 16gb 4vcpu) with sequence aligner",
          acronym: "ec2aligner",
          active: 1,
          id_provider:0,
          provisionable: 1,
          parameters:{
            instancetype: "t4g.xlarge",
            ami: "ami-0f6ef8dcbf23a4dc1",
            region: "us-east-1"
          }
        },
        {     
          id: 85,
          name: "EC2 c6g.2xlarge (arm 16gb 8vcpu) with sequence aligner",
          acronym: "ec2aligner",
          active: 1,
          id_provider:0,
          provisionable: 1,
          parameters:{
            instancetype: "c6g.2xlarge",
            ami: "ami-0f6ef8dcbf23a4dc1",
            region: "us-east-1"
          }
        },
        {     
          id: 86,
          name: "EC2 c6g.4xlarge (arm 32gb 16vcpu) with sequence aligner",
          acronym: "ec2aligner",
          active: 1,
          id_provider:0,
          provisionable: 1,
          parameters:{
            instancetype: "c6g.4xlarge",
            ami: "ami-0f6ef8dcbf23a4dc1",
            region: "us-east-1"
          }
        },
        {     
          id: 87,
          name: "EC2 c6g.8xlarge (arm 64gb 32vcpu) with sequence aligner",
          acronym: "ec2aligner",
          active: 1,
          id_provider:0,
          provisionable: 1,
          parameters:{
            instancetype: "c6g.8xlarge",
            ami: "ami-0f6ef8dcbf23a4dc1",
            region: "us-east-1"
          }
        },
        {     
          id: 88,
          name: "EC2 t3a.xlarge (x86 16gb 4vcpu) with sequence aligner",
          acronym: "ec2aligner",
          active: 1,
          id_provider:0,
          provisionable: 1,
          parameters:{
            instancetype: "t3a.xlarge",
            ami: "ami-01893222c83843146",
            region: "us-east-1"
          }
        },
        {     
          id: 89,
          name: "EC2 c5a.2xlarge (x86 16gb 8vcpu) with sequence aligner",
          acronym: "ec2aligner",
          active: 1,
          id_provider:0,
          provisionable: 1,
          parameters:{
            instancetype: "c5a.2xlarge",
            ami: "ami-01893222c83843146",
            region: "us-east-1"
          }
        },
        {     
          id: 90,
          name: "EC2 c5a.4xlarge (x86 32gb 16vcpu) with sequence aligner",
          acronym: "ec2aligner",
          active: 1,
          id_provider:0,
          provisionable: 1,
          parameters:{
            instancetype: "c5a.4xlarge",
            ami: "ami-01893222c83843146",
            region: "us-east-1"
          }
        },
        {     
          id: 91,
          name: "EC2 c5a.8xlarge (x86 64gb 32vcpu) with sequence aligner",
          acronym: "ec2aligner",
          active: 1,
          id_provider:0,
          provisionable: 1,
          parameters:{
            instancetype: "c5a.8xlarge",
            ami: "ami-01893222c83843146",
            region: "us-east-1"
          }
        },

        // Sequence Aligner (FaaS) for AFMC framework

        {     
          id: 92,
          name: "Lambda (512mb) with sequence aligner",
          acronym: "lambdaaligner",
          active: 1,
          id_provider:0,
          provisionable: 1,
          parameters:{memory:512}
        },
        {     
          id: 93,
          name: "Lambda (1024mb) with sequence aligner",
          acronym: "lambdaaligner",
          active: 1,
          id_provider:0,
          provisionable: 1,
          parameters:{memory:1024}
        },
        {     
          id: 94,
          name: "Lambda (1536mb) with sequence aligner",
          acronym: "lambdaaligner",
          active: 1,
          id_provider:0,
          provisionable: 1,
          parameters:{memory:1536}
        },
        {     
          id: 95,
          name: "Lambda (2048mb) with sequence aligner",
          acronym: "lambdaaligner",
          active: 1,
          id_provider:0,
          provisionable: 1,
          parameters:{memory:2048}
        },
        {     
          id: 96,
          name: "Lambda (2560mb) with sequence aligner",
          acronym: "lambdaaligner",
          active: 1,
          id_provider:0,
          provisionable: 1,
          parameters:{memory:2560}
        },
        {     
          id: 97,
          name: "Lambda (3072mb) with sequence aligner",
          acronym: "lambdaaligner",
          active: 1,
          id_provider:0,
          provisionable: 1,
          parameters:{memory:3072}
        },

        // Sequence Aligner (VM) for Node2FaaS framework    

        {     
          id: 98,
          name: "EC2 t3a.xlarge with sequence aligner for node2faas ",
          acronym: "n2fec2alignernofaas",
          active: 1,
          id_provider:0,
          provisionable: 1,
          parameters:{
            instancetype: "t3a.xlarge",
            ami: "ami-01893222c83843146",
            region: "us-east-1"
          }
        },

        // Sequence Aligner (FaaS) for Node2FaaS framework    

        {     
          id: 99,
          name: "EC2 t3a.xlarge with sequence aligner converted by node2faas ",
          acronym: "n2fec2alignerfaas",
          active: 1,
          id_provider:0,
          provisionable: 1,
          parameters:{
            instancetype: "t3a.xlarge",
            ami: "ami-01893222c83843146",
            region: "us-east-1"
          }
        },
        
        
      ]);
    });
  };
