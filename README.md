# orama
Orama framework

## Requisites

- Docker
- Docker Compose

## How to use

- Clone this project
- Enter `src` folder
- Execute: `docker-compose up -d --build`
- Execute: `docker-compose exec backend knex seed:run`
- Open your Brownser and type: http://localhost:3000

## APIs

 - Backend: http://localhost:3001
 - Orchestrator: http://localhost:3100
 - Benchmarker: http://localhost:3200

## Use cases

### Lambda as backend to DynamoDB
![lambda2dynamodb](../../blob/main/diagrams/usecases/orama-usecase-lambda2dynamodb.drawio.png)

In this use case 3 AWS lambda roles are provisioned to interact with a DynamoDB table that is also provisioned together.

 - **POST Function: 
   - Performs the inclusion of a JSON sent in the body via post.

 - **GET function: 
   - Returns all items in DynamoDB segment 0. Accepts `segment` and `totalSegments` parameters to move the segment pointer in the DynamoDB table.

 - **DELETE function: 
   - Receives the `id` parameter and removes the respective item in the DynamoDB table.


### FaaS as backend to DBaaS

 - Requeriments
    - AWS
    - GCP
      - Permisions 
        - Cloud Functions Administrator
        - Firebase Cloud Storage Administrator
        - Service account user
        - Storage Administrator
        - IAM Administrator
        - Roles Administrator
      - Activate APIs
        - Cloud Build (https://console.developers.google.com/apis/api/cloudbuild.googleapis.com/overview?project=`YOUPROJECTNUMBER`)
        - Cloud Functions (https://console.developers.google.com/apis/api/cloudfunctions.googleapis.com/overview?project=`YOUPROJECTNUMBER`)
        - Cloud Firestore (https://console.developers.google.com/apis/api/cloudresourcemanager.googleapis.com/overview?project=`YOUPROJECTNUMBER`)


      
