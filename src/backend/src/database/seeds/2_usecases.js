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
          id: 2,
          name: "GCF Function as backend to Firestore",
          acronym: "gcf2firestore",
          active: 1,
          id_provider:2,
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
          id: 4,
          name: "GCP Function as backend to Google Cloud Storage",
          acronym: "gcf2gcstorage",
          active: 1,
          id_provider:2,
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
          id: 6,
          name: "GCF Calculator US-east",
          acronym: "gcfcalc",
          active: 1,
          id_provider:2,
          provisionable: 1,
          parameters:{
            region: "us-east4"
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
          id: 21,
          name: "GCP e2-standard-4 (16gb 4vcpu) with sequence aligner",
          acronym: "gcaligner",
          active: 1,
          id_provider:2,
          provisionable: 1,
          parameters:{
            instancetype: "e2-standard-4",
            image: "debian-cloud/debian-10",
            zone: "us-central1-a"
          }
        },
        {     
          id: 22,
          name: "GCP e2-highcpu-8 (8gb 8vcpu) with sequence aligner",
          acronym: "gcaligner",
          active: 1,
          id_provider:2,
          provisionable: 1,
          parameters:{
            instancetype: "e2-highcpu-8",
            image: "debian-cloud/debian-10",
            zone: "us-central1-a"
          }
        },
        {     
          id: 23,
          name: "GCP e2-highcpu-16 (16gb 16vcpu) with sequence aligner",
          acronym: "gcaligner",
          active: 1,
          id_provider:2,
          provisionable: 1,
          parameters:{
            instancetype: "e2-highcpu-16",
            image: "debian-cloud/debian-10",
            zone: "us-central1-a"
          }
        },
        {     
          id: 24,
          name: "GCP e2-highcpu-32 (32gb 32vcpu) with sequence aligner",
          acronym: "gcaligner",
          active: 1,
          id_provider:2,
          provisionable: 1,
          parameters:{
            instancetype: "e2-highcpu-32",
            image: "debian-cloud/debian-10",
            zone: "us-central1-a"
          }
        },
        {     
          id: 25,
          name: "GCF (512mb) with sequence aligner",
          acronym: "gcfaligner",
          active: 1,
          id_provider:2,
          provisionable: 1,
          parameters:{memory: 512}
        },
        {     
          id: 26,
          name: "GCF (1024mb) with sequence aligner",
          acronym: "gcfaligner",
          active: 1,
          id_provider:2,
          provisionable: 1,
          parameters:{memory: 1024}
        },
        
        {     
          id: 27,
          name: "GCF (2048mb) with sequence aligner",
          acronym: "gcfaligner",
          active: 1,
          id_provider:2,
          provisionable: 1,
          parameters:{memory: 2048}
        },
        {     
          id: 28,
          name: "GCF (4096mb) with sequence aligner",
          acronym: "gcfaligner",
          active: 1,
          id_provider:2,
          provisionable: 1,
          parameters:{memory: 4096}
        },
        {     
          id: 29,
          name: "Azure Standard_D4s_v3 (16gb 4vcpu) with sequence aligner",
          acronym: "azurealigner",
          active: 1,
          id_provider:3,
          provisionable: 1,
          parameters:{
            instancetype: "Standard_D4s_v3",
            location: "westus",
            image_publisher: "debian",
            image_offer: "debian-10",
            image_sku: "10-gen2",
            image_version: "latest"
          },
        },
        {     
          id: 30,
          name: "Azure Standard_D8s_v3 (32gb 8vcpu) with sequence aligner",
          acronym: "azurealigner",
          active: 1,
          id_provider:3,
          provisionable: 1,
          parameters:{
            instancetype: "Standard_D8s_v3",
            location: "westus",
            image_publisher: "debian",
            image_offer: "debian-10",
            image_sku: "10-gen2",
            image_version: "latest"
          }
        },
        {     
          id: 31,
          name: "Azure Standard_D16s_v4 (64gb 16vcpu) with sequence aligner",
          acronym: "azurealigner",
          active: 1,
          id_provider:3,
          provisionable: 1,
          parameters:{
            instancetype: "Standard_D16s_v4",
            location: "westus",
            image_publisher: "debian",
            image_offer: "debian-10",
            image_sku: "10-gen2",
            image_version: "latest"
          }
        },
        {     
          id: 32,
          name: "Azure Standard_D32s_v4 (128gb 32vcpu) with sequence aligner",
          acronym: "azurealigner",
          active: 1,
          id_provider:3,
          provisionable: 1,
          parameters:{
            instancetype: "Standard_D32s_v4",
            location: "westus",
            image_publisher: "debian",
            image_offer: "debian-10",
            image_sku: "10-gen2",
            image_version: "latest"
          }
        },
        {     
          id: 33,
          name: "AZF with sequence aligner",
          acronym: "azfaligner",
          active: 1,
          id_provider:3,
          provisionable: 1,
          parameters:{},
        },
        
        {     
          id: 34,
          name: "AZF as backend to CosmosDB",
          acronym: "azf2cosmosdb",
          active: 1,
          id_provider:3,
          provisionable: 1
        },
        {     
          id: 35,
          name: "AZF as backend to BlobStorage",
          acronym: "azf2blobstorage",
          active: 1,
          id_provider: 3,
          provisionable: 1
        },
        {     
          id: 36,
          name: "AZF Calculator US-east",
          acronym: "azfcalc",
          active: 1,
          id_provider: 3,
          provisionable: 1,
          parameters:{
            region: "East US"
          }
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
          id: 39,
          name: "GCP e2-standard-4 with sequence aligner for node2faas",
          acronym: "n2fgcalignernofaas",
          active: 1,
          id_provider:2,
          provisionable: 1,
          parameters:{
            instancetype: "e2-standard-4",
            image: "debian-cloud/debian-10",
            zone: "us-central1-a"
          }
        },
        {     
          id: 40,
          name: "GCP e2-standard-4 with sequence aligner converted by node2faas",
          acronym: "n2fgcalignerfaas",
          active: 1,
          id_provider:2,
          provisionable: 1,
          parameters:{
            instancetype: "e2-standard-4",
            image: "debian-cloud/debian-10",
            zone: "us-central1-a"
          }
        },
        {     
          id: 41,
          name: "Azure Standard_D4s_v3 with sequence aligner for node2faas",
          acronym: "n2fazralignernofaas",
          active: 1,
          id_provider:3,
          provisionable: 1,
          parameters:{
            instancetype: "Standard_D4s_v3",
            location: "westus",
            image_publisher: "debian",
            image_offer: "debian-10",
            image_sku: "10-gen2",
            image_version: "latest"
          }
        },
        {     
          id: 42,
          name: "Azure Standard_D4s_v3 with sequence aligner converted by node2faas",
          acronym: "n2fazralignerfaas",
          active: 1,
          id_provider:3,
          provisionable: 1,
          parameters:{
            instancetype: "Standard_D4s_v3",
            location: "westus",
            image_publisher: "debian",
            image_offer: "debian-10",
            image_sku: "10-gen2",
            image_version: "latest"
          }
        },
        {     
          id: 43,
          name: "AFC Calculator US-east",
          acronym: "alicalc",
          active: 1,
          id_provider:4,
          provisionable: 1,
          parameters:{
            region: "us-east-1"
          }
        },
        {     
          id: 44,
          name: "AFC as backend to OSS",
          acronym: "ali2oss",
          active: 1,
          id_provider:4,
          provisionable: 1
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
          id: 46,
          name: "GCF Calculator US-west",
          acronym: "gcfcalc",
          active: 1,
          id_provider:2,
          provisionable: 1,
          parameters:{
            region: "us-west2"
          }
        },
        {     
          id: 47,
          name: "AZF Calculator US-west",
          acronym: "azfcalc",
          active: 1,
          id_provider: 3,
          provisionable: 1,
          parameters:{
            region: "West US"
          }
        },
        {     
          id: 48,
          name: "AFC Calculator US-west",
          acronym: "alicalc",
          active: 1,
          id_provider:4,
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
          id: 50,
          name: "GCF Calculator Frankfurt",
          acronym: "gcfcalc",
          active: 1,
          id_provider:2,
          provisionable: 1,
          parameters:{
            region: "europe-west3"
          }
        },
        {     
          id: 51,
          name: "AZF Calculator Frankfurt",
          acronym: "azfcalc",
          active: 1,
          id_provider: 3,
          provisionable: 1,
          parameters:{
            region: "Germany West Central"
          }
        },
        {     
          id: 52,
          name: "AFC Calculator frankfurt",
          acronym: "alicalc",
          active: 1,
          id_provider:4,
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
          id: 54,
          name: "GCF Calculator Hong Kong",
          acronym: "gcfcalc",
          active: 1,
          id_provider:2,
          provisionable: 1,
          parameters:{
            region: "asia-east2"
          }
        },
        {     
          id: 55,
          name: "AZF Calculator Hong Kong",
          acronym: "azfcalc",
          active: 1,
          id_provider: 3,
          provisionable: 1,
          parameters:{
            region: "East Asia"
          }
        },
        {     
          id: 56,
          name: "AFC Calculator Hong Kong",
          acronym: "alicalc",
          active: 1,
          id_provider:4,
          provisionable: 1,
          parameters:{
            region: "cn-hongkong"
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
        {     
          id: 58,
          name: "GCF Calculator Australia",
          acronym: "gcfcalc",
          active: 1,
          id_provider:2,
          provisionable: 1,
          parameters:{
            region: "australia-southeast1"
          }
        },
        {     
          id: 59,
          name: "AZF Calculator Australia",
          acronym: "azfcalc",
          active: 1,
          id_provider: 3,
          provisionable: 1,
          parameters:{
            region: "Australia Southeast"
          }
        },
        {     
          id: 60,
          name: "AFC Calculator Australia",
          acronym: "alicalc",
          active: 1,
          id_provider:4,
          provisionable: 1,
          parameters:{
            region: "ap-southeast-2"
          }
        },
        {
          id: 61,
          name: "AFC as backend to TableStore",
          acronym: "ali2tablestore",
          active: 1,
          id_provider:4,
          provisionable: 1
        }
      ]);
    });
  
  await knex.schema.raw('ALTER SEQUENCE tb_usecase_id_seq RESTART WITH 999;')
};
