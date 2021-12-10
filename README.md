# Orama
Orama framework

## Description

Orama framework is a support tool for evaluating Funtion as a Service-oriented services. It assists in the tasks of **provisioning** and **deprovisioning** use-case environments, configuring and **running benchmarks**, and **analyzing** the results through **factorial design**.

## Requisites

- Docker
- Docker Compose

## How to use

- Clone this project
- Enter `src` folder
- Create a .env file and fill with:
  - (required) BACKEND_URL=http://[IP ADDRESS]:3001/backend/api/v1
  - (required) BENCHMARKER_URL=http://[IP ADDRESS]:3100/
  - (required) ORCHESTRATOR_URL=http://[IP ADDRESS]:3200/
  - (required) POSTGRES_DB=[database]
  - (required) POSTGRES_USER=[database user]
  - (required) POSTGRES_PASSWORD=[database password]
  - (optional) AWS_ACCESS_KEY_ID=[your AWS access key id]
  - (optional) AWS_SECRET_ACCESS_KEY=[your AWS access key]
  - (optional) GCP_JSON_FILE=[path to your GCP access json file]
  - (optional) GCP_PROJECT_ID=[your GCP project_id]
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
  - GCP
    - **Permisions** 
      - Cloud Functions Administrator
      - Firebase Cloud Storage Administrator
      - Service account user
      - Storage Administrator
      - IAM Administrator
      - Roles Administrator
    - **Activate APIs**
      - Cloud Build (https://console.developers.google.com/apis/api/cloudbuild.googleapis.com/overview?project=`YOUPROJECTNUMBER`)
      - Cloud Functions (https://console.developers.google.com/apis/api/cloudfunctions.googleapis.com/overview?project=`YOUPROJECTNUMBER`)
      - Cloud Firestore (https://console.developers.google.com/apis/api/cloudresourcemanager.googleapis.com/overview?project=`YOUPROJECTNUMBER`)


      
