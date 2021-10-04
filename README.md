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
### 2. Google Cloud Functions calculator
![lambdagcfcalc](../../blob/main/diagrams/usecases/orama-usecase-gcfcalc.drawio.png)
### 3. Lambda as backend to DynamoDB
![lambda2dynamodb](../../blob/main/diagrams/usecases/orama-usecase-lambda2dynamodb.drawio.png)

In this use case 3 AWS lambda functions are provisioned to interact with a DynamoDB table that is also provisioned together.

 - **POST Function:** 
   - Performs the inclusion of a JSON sent in the body via post.

 - **GET function:** 
   - Returns all items in DynamoDB segment 0. Accepts `segment` and `totalSegments` parameters to move the segment pointer in the DynamoDB table.

 - **DELETE function:** 
   - Receives the `id` parameter and removes the respective item in the DynamoDB table.

### 4. Google Cloud Functions as backend to Firestore
![gcf2firestore](../../blob/main/diagrams/usecases/orama-usecase-gcf2firestore.drawio.png)

### 5. Lambda as backend to S3
![lambda2s3](../../blob/main/diagrams/usecases/orama-usecase-lambda2s3.drawio.png)

### 6. Google Cloud Functions as backend to Google Cloud Storage
![gcf2gstorage](../../blob/main/diagrams/usecases/orama-usecase-gcf2gstorage.drawio.png)



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


      
