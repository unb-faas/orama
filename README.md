# Orama
Orama framework

## Description

Orama framework is a support tool for evaluating Funtion as a Service-oriented services. It assists in the tasks of **provisioning** and **deprovisioning** use-case environments, configuring and **running benchmarks**, and **analyzing** the results through **factorial design**.

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


## How to use

- Clone this project
- Enter `src` folder
- Create a .env file and fill with (check .env.example file):
  - (required) BACKEND_URL=http://`[IP ADDRESS]`:3001/backend/api/v1
  - (required) BENCHMARKER_URL=http://`[IP ADDRESS]`:3100/
  - (required) ORCHESTRATOR_URL=http://`[IP ADDRESS]`:3200/
  - (required) POSTGRES_DB=`[database]`
  - (required) POSTGRES_USER=`[database user]`
  - (required) POSTGRES_PASSWORD=`[database password]`
  - (optional) AWS_ACCESS_KEY_ID=`[your AWS access key id]`
  - (optional) AWS_SECRET_ACCESS_KEY=`[your AWS access key]`
  - (optional) GCP_JSON_FILE=`[path to your GCP access json file]`
  - (optional) GCP_PROJECT_ID=`[your GCP project_id]`
  - (optional) AZURE_SUBSCRIPTION_ID=`[your Azure subscription_id]`
  - (optional) AZURE_TENANT_ID=`[your Azure tenant_id]`
  - (optional) AZURE_CLIENT_ID=`[your Azure client_id]`
  - (optional) AZURE_CLIENT_SECRET=`[your Azure client_secret]`
- Execute: `docker-compose up -d`
- Execute: `docker-compose exec backend knex seed:run`
- Open your Brownser and type: http://localhost:3000

## APIs

 - Backend: http://localhost:3001
 - Orchestrator: http://localhost:3100
 - Benchmarker: http://localhost:3200

## Use cases

### 1. Lambda calculator
![lambdacalc](../../blob/main/diagrams/usecases/orama-usecase-lambdacalc.drawio.png)

In this use case one AWS lambda function is provisioned. This function receives parameters: `a` ,`b` and `operation` and return the result.

### 2. Google Cloud Functions calculator
![lambdagcfcalc](../../blob/main/diagrams/usecases/orama-usecase-gcfcalc.drawio.png)

In this use case one AWS lambda function is provisioned. This function receives parameters: `a` ,`b` and `operation` and return the result.

### 3. Lambda as backend to DynamoDB
![lambda2dynamodb](../../blob/main/diagrams/usecases/orama-usecase-lambda2dynamodb.drawio.png)

In this use case 3 AWS lambda functions are provisioned to interact with a DynamoDB table that is also provisioned together.

 - **POST Function:** 
   - Performs the inclusion of a JSON sent in the body.

 - **GET function:** 
   - Returns all items in DynamoDB segment 0. Accepts `segment` and `totalSegments` parameters to move the segment pointer in the DynamoDB table.

 - **DELETE function:** 
   - Receives the `id` parameter and removes the respective item in the DynamoDB table.

### 4. Google Cloud Functions as backend to Firestore
![gcf2firestore](../../blob/main/diagrams/usecases/orama-usecase-gcf2firestore.drawio.png)

In this use case 3 GCF functions are provisioned to interact with a Firestore table that is also provisioned together.

 - **POST Function:** 
   - Performs the inclusion of a JSON sent in the `value` parameter of the body.

 - **GET function:** 
   - Returns all items in the Firestore.

 - **DELETE function:** 
   - Receives the `id` parameter and removes the respective item in the Firestore table.


### 5. Lambda as backend to S3
![lambda2s3](../../blob/main/diagrams/usecases/orama-usecase-lambda2s3.drawio.png)

In this use case 3 AWS lambda functions are provisioned to interact with files inside a S3 bucket that is also provisioned together.

 - **POST Function:** 
   - Performs the creation of a JSON file inside the S3 bucket whose content is the body sent. Creates aleatory Ids for each create file.

 - **GET function:** 
   - Returns a list Ids for each file present in the bucket. If parameter `id` is passed, them the content of respective file is returned.

 - **DELETE function:** 
   - Receives the `id` parameter and removes the respective file in the S3 bucket.

### 6. Google Cloud Functions as backend to Google Cloud Storage
![gcf2gstorage](../../blob/main/diagrams/usecases/orama-usecase-gcf2gstorage.drawio.png)

In this use case 3 GCF functions are provisioned to interact with files inside a Google Cloud Storage bucket that is also provisioned together.

 - **POST Function:** 
   - Performs the creation of a JSON file inside the Cloud Storage bucket whose content is the body sent. Creates aleatory Ids for each create file.

 - **GET function:** 
   - Returns a list Ids for each file present in the bucket. If parameter `id` is passed, them the content of respective file is returned.

 - **DELETE function:** 
   - Receives the `id` parameter and removes the respective file in the Cloud Storage bucket.

### 7. Genetic Sequence Aligner

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