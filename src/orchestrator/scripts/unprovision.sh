#!/bin/bash
ID=$1
USECASE=$2
PROVISION_FOLDER="/provisions/${ID}/${USECASE}"
cd ${PROVISION_FOLDER}/blueprints
PROVIDERS=$(ls)
for PROVIDER in ${PROVIDERS};do
  if [ "$(echo ${PROVIDER} | sed -e 's/ //g')" == "aws" ]; then
    VARS="  -var AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} \
        -var AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} \
    "
  fi

  if [ "$(echo ${PROVIDER} | sed -e 's/ //g')" == "azure" ]; then
    VARS="  -var client_secret=${CLIENT_SECRET} \
        -var client_id=${CLIENT_ID} \
        -var subscription_id=${SUBSCRIPTION_ID} \
        -var tenant_id=${TENANT_ID} \
    "
  fi

  if [ "$(echo ${PROVIDER} | sed -e 's/ //g')" == "gcp" ]; then
    VARS="  -var GCP_JSON_FILE=${GCP_JSON_FILE} \
            -var GCP_PROJECT_ID=${GCP_PROJECT_ID} \
    "
  fi
    
  echo "Unprovisioning on ${PROVIDER}"
  cd ${PROVIDER}
  mkdir -p /logs/${ID}/${USECASE}/
  DATE=$(date +%Y-%m-%d-%H-%M-%S)
  echo "Unprovision started at ${DATE} on ${PROVIDER}"
  /usr/local/bin/terraform destroy $VARS -auto-approve 2>&1 | tee -a /logs/${ID}/${USECASE}/unprovision.log
  DATE=$(date +%Y-%m-%d-%H-%M-%S)
  echo "Unprovision finished at ${DATE} on ${PROVIDER}"
  cd -
done

