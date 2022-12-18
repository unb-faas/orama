![logo](../../blob/main/diagrams/logo.png)


## Description

Orama framework is a support tool for evaluating Function-as-a-Service-oriented environments. It assists in the tasks of **provisioning** and **deprovisioning** use-case environments, configuring and **running benchmarks**, and **analyzing** the results through **factorial design** and t-tests.

## Architecture

The Orama framework is composed by the following components running in Docker:
 - Frontend: a Node.Js + React application;
 - Backend: a Node.js + Express + Swagger application that receives and process requests from other services;
 - Database: a Postgres standalone instance;
 - Orchestrator: a Node.js + Express + Swagger + Terraform application that process provisioning and deprovisiong requests;
 - Benchmarker: a Node.js + Express + Swagger + JMeter application that process benchmark requests and can be installed in the same host where the other services are installed or be installed isolated in remove machines;
 - Kafka: a Apache Kafka + Zookeeper messages manager that distributes the benchmarks jobs to remote workers, such as Benchmarkers.

![arch](../../blob/main/diagrams/arch.png)

### Workflow

The main workflow of the framework is shown in the follow diagram.

![workflow](../../blob/main/diagrams/workflow.png)


## Requisites

- Docker
- Docker Compose

### Providers Requirements

To use this framework it is necessary to have accounts in the providers that you want to provision use cases. In addition, it is necessary to ensure that the user has the following permissions:

  - AWS
    - **Permisions:**  
      -  AmazonS3OutpostsFullAccess
      -  AmazonS3ObjectLambdaExecutionRolePolicy
      -  AmazonS3FullAccess
      -  AmazonAPIGatewayInvokeFullAccess
      -  AmazonDynamoDBFullAccess
      -  AdministratorAccess
      -  AmazonAPIGatewayAdministrator
      -  AWSLambdaBasicExecutionRole
      -  AmazonS3OutpostsFullAccess  
    - **Credentials:**
      - Obtain the ACCESS_KEY_ID and SECRET_ACCESS_KEY

  - GCP
    - **Permisions** 
      - Cloud Datastore Owner
      - Cloud Functions Admin
      - Cloud Storage for Firebase Admin
      - Compute Admin
      - Role Administrator
      - Security Admin
      - Service Account User
      - Storage Admin 
     
    - **Activate APIs**
      - Cloud Build (https://console.developers.google.com/apis/api/cloudbuild.googleapis.com/overview?project=`YOUPROJECTNUMBER`)
      - Cloud Functions (https://console.developers.google.com/apis/api/cloudfunctions.googleapis.com/overview?project=`YOUPROJECTNUMBER`)
      - Cloud Firestore (https://console.developers.google.com/apis/api/cloudresourcemanager.googleapis.com/overview?project=`YOUPROJECTNUMBER`)
    
    - **Credentials:**
      - Create a service account and get the .json file with the credentials keys

  - Azure
    
    - **Credentials:**
      - Obtain SUBSCRIPTION_ID, TENANT_ID, CLIENT_ID and CLIENT_SECRET keys

  - Alibaba
    - **Permisions:**  
      - AliyunRAMFullAccess, AliyunLogFullAccess, AliyunFCFullAccess, AliyunOSSFullAccess
    - **Credentials:**
      - Obtain the ALICLOUD_ACCESS_KEY and ALICLOUD_SECRET_KEY


## How to use

- Clone this project
- Enter `src` folder
- Create a .env file and fill with (check .env.example file):
  - (required) ENVIRONMENT=`[your environment name, for example: dev]`
  - (required) BACKEND_URL=http://`[IP ADDRESS]`:3001/backend/api/v1
  - (required) BENCHMARKER_URL=http://`[IP ADDRESS]`:3100/
  - (required) ORCHESTRATOR_URL=http://`[IP ADDRESS]`:3200/
  - (required) POSTGRES_DB=`[database]`
  - (required) POSTGRES_USER=`[database user]`
  - (required) POSTGRES_PASSWORD=`[database password]`
  - (required) KAFKA_URL=`[IP ADDRESS]`:9092
  - (required) WORKER_NAME=`[a name for your worker, for example: default]`
  - (optional) AWS_ACCESS_KEY_ID=`[your AWS access key id]`
  - (optional) AWS_SECRET_ACCESS_KEY=`[your AWS access key]`
  - (optional) GCP_JSON_FILE=`[path to your GCP access json file]`
  - (optional) GCP_PROJECT_ID=`[your GCP project_id]`
  - (optional) AZURE_SUBSCRIPTION_ID=`[your Azure subscription_id]`
  - (optional) AZURE_TENANT_ID=`[your Azure tenant_id]`
  - (optional) AZURE_CLIENT_ID=`[your Azure client_id]`
  - (optional) AZURE_CLIENT_SECRET=`[your Azure client_secret]`
  - (optional) ALICLOUD_ACCESS_KEY=`[your Alibaba AccessKeyId]`
  - (optional) ALICLOUD_SECRET_KEY=`[your Alibaba AccessKeySecret]`
- Execute: `docker-compose up -d`
- Execute: `docker-compose exec backend knex seed:run`
- Open your Brownser and type: http://localhost:3000

## How to configure a remote benchmark worker

- Clone this project
- Enter `src` folder
- Create a .env file and fill with (check .env.example file):
  - (required) ENVIRONMENT=`[your environment name, for example: dev]`
  - (required) BACKEND_URL=http://`[IP ADDRESS]`:3001/backend/api/v1
  - (required) KAFKA_URL=`[IP ADDRESS]`:9092
  - (required) WORKER_NAME=`[a name for your worker, for example: default]`
- Execute: `docker-compose -f docker-compose-worker.yaml up -d`

* The worker should appears in the workers list in the Orama interface.

## APIs

 - Backend: http://localhost:3001
 - Orchestrator: http://localhost:3100
 - Benchmarker: http://localhost:3200

## Use cases

### 1. Calculators

In this use case one function is provisioned that receives parameters: `a` ,`b` and `operation` and return the result.

#### 1.1 Lambda calculator
![lambdacalc](../../blob/main/diagrams/usecases/lambda-calc.drawio.png)

#### 1.2 Google Cloud Function calculator
![lambdagcfcalc](../../blob/main/diagrams/usecases/gcf-calc.drawio.png)

#### 1.3 Microsoft Azure Function calculator
![lambdagcfcalc](../../blob/main/diagrams/usecases/azf-calc.drawio.png)

#### 1.4 Alibaba Function Cloud calculator
![lambdagcfcalc](../../blob/main/diagrams/usecases/afc-calc.drawio.png)

### 2. API for Database

In this use case 3 functions are provisioned to interact with a noSQL table that is also provisioned together.

 - **POST Function:** 
   - Performs the inclusion of a JSON sent in the body.

 - **GET function:** 
   - Returns all items in the table.

 - **DELETE function:** 
   - Receives the `id` parameter and removes the respective item in the table.

#### 2.1 Lambda as API to DynamoDB
![lambda2dynamodb](../../blob/main/diagrams/usecases/lambda2dynamodb.drawio.png)

DynamoDB Accepts `segment` and `totalSegments` parameters to move the segment pointer in the DynamoDB table.

#### 2.2 GCF as API to Firestore
![gcf2firestore](../../blob/main/diagrams/usecases/gcf2firestore.drawio.png)

#### 2.3 AZF as API to CosmosDB
![azf2cosmosdb](../../blob/main/diagrams/usecases/azf2cosmosdb.drawio.png)

#### 2.4 AFC as API to TableStore (under construction)

### 3. API for Object Storage

In this use case 3 functions are provisioned to interact with files inside a object storage bucket that is also provisioned together.

 - **POST Function:** 
   - Performs the creation of a JSON file inside the bucket whose content is the body sent. Creates aleatory Ids for each create file.

 - **GET function:** 
   - Returns a list Ids for each file present in the bucket. If parameter `id` is passed, them the content of respective file is returned.

 - **DELETE function:** 
   - Receives the `id` parameter and removes the respective file in the bucket.

#### 3.1 Lambda as API to S3

![lambda2s3](../../blob/main/diagrams/usecases/lambda2s3.drawio.png)

#### 3.2 GCF as API to Google Cloud Storage
![gcf2gstorage](../../blob/main/diagrams/usecases/orama-usecase-gcf2gstorage.drawio.png)

#### 3.3 AZF as API to Azure Blob Storage
![azf2blobstorage](../../blob/main/diagrams/usecases/azf2blobstorage.drawio.png)

#### 3.4 AFC as API to Alibaba Object Storage Service
![afc2oss](../../blob/main/diagrams/usecases/afc2oss.drawio.png)


### 4. Genetic Sequence Aligner

This use case is distributed in many others use cases. It can be deployed on IaaS and FaaS services of AWS EC2 and Lambda, Azure VM and Function, and GCP Cloud Compute and Function. This use case is compose by an application to align two genetic sequences using Hirshberg Algorithm. It is written in Python. There are many flavors of VMs and FaaS configurations as follow:

- AWS:
  - t3a.xlarge (x86)
  - c5a.2xlarge (x86)
  - c5a.4xlarge (x86)
  - c5a.8xlarge (x86)
  - t4g.xlarge (arm)
  - c6g.2xlarge (arm)
  - c6g.4xlarge (arm)
  - c6g.8xlarge (arm)
  - lambda-1.0GB
  - lambda-1.5GB
  - lambda-2.0GB
  - lambda-2.5GB
  - lambda-3.0GB
- Azure\*:
  - standard-d4s-v3 (x86)
  - standard-d8s-v3 (x86)
  - standard-d16s-v4 (x86)
  - standard-d32s-v4 (x86)
  - function
  
  \* For Azure is necessary to create a storage account, get the respective connection string and fill the parameter storageConnection in the benchmarks parameters.
  
- GCP:
  - e2-standard-4  (x86)
  - e2-highcpu-8  (x86)
  - e2-highcpu-16 (x86)
  - e2-highcpu-32 (x86)
  - gcf-0.5GB
  - gcf-1.0GB
  - gcf-2.0GB
  - gcf-4.0GB

  ## Publications

   - 2022 - CLOSER - **Orama: A Benchmark Framework for Function-as-a-Service** https://www.scitepress.org/Papers/2022/111139/
     - How to cite: @conference{closer22,
                        author={Leonardo Carvalho and Aleteia Araujo},
                        title={Orama: A Benchmark Framework for Function-as-a-Service},
                        booktitle={Proceedings of the 12th International Conference on Cloud Computing and Services Science - Volume 1: CLOSER,},
                        year={2022},
                        pages={313-322},
                        publisher={SciTePress},
                        organization={INSTICC},
                        doi={10.5220/0011113900003200},
                        isbn={978-989-758-570-8},
                    }

## Test data

For access the data generated in tests using the Orama Framework, please go to this project: https://github.com/unb-faas/orama-results

## Contact and Support

Please send me a message to leouesb@gmail.com