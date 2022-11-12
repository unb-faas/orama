#!/bin/bash
ID=$1
USECASE=$2
EXTRAVARS="$(echo ${3} | sed -e 's/\&/ /g')"
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
    VARS="  -var CLIENT_SECRET=${AZURE_CLIENT_SECRET} \
            -var CLIENT_ID=${AZURE_CLIENT_ID} \
            -var SUBSCRIPTION_ID=${AZURE_SUBSCRIPTION_ID} \
            -var TENANT_ID=${AZURE_TENANT_ID} \
      "
  fi

  if [ "$(echo ${PROVIDER} | sed -e 's/ //g')" == "gcp" ]; then
    VARS="  -var GCP_JSON_FILE=${GCP_JSON_FILE} \
            -var GCP_PROJECT_ID=${GCP_PROJECT_ID} \
    "
  fi
  
  if [ "$(echo ${PROVIDER} | sed -e 's/ //g')" == "ali" ]; then
    VARS="  -var ALICLOUD_ACCESS_KEY=${ALICLOUD_ACCESS_KEY} \
            -var ALICLOUD_SECRET_KEY=${ALICLOUD_SECRET_KEY} \
    "
  fi
    
  echo "Unprovisioning on ${PROVIDER}"
  cd ${PROVIDER}
  mkdir -p /logs/${ID}/${USECASE}/
  DATE=$(date +%Y-%m-%d-%H-%M-%S)
  echo "Unprovision started at ${DATE} on ${PROVIDER}"
  /usr/local/bin/terraform destroy ${VARS} ${EXTRAVARS} -auto-approve 2>&1 | tee -a /logs/${ID}/${USECASE}/unprovision.log
  DATE=$(date +%Y-%m-%d-%H-%M-%S)
  echo "Unprovision finished at ${DATE} on ${PROVIDER}"
  cd -
done

