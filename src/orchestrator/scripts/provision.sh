#!/bin/bash
ID=$1
USECASE=$2
EXTRAVARS="$(echo ${3} | sed -e 's/\&/ /g')"
PROVISION_FOLDER="/provisions/${ID}/${USECASE}"

if [ -d "${PROVISION_FOLDER}/faas/" ]; then
  cd ${PROVISION_FOLDER}/faas/
  PROVIDERS=$(ls)
  for PROVIDER in ${PROVIDERS}; do
      cd ${PROVIDER}
      FAASs=$(ls)
      for FAAS in ${FAASs}; do
          cd ${FAAS}
          rm -f ${FAAS}.zip
          zip -r ${FAAS}.zip * .python_packages >> /dev/null
          cd - >> /dev/null
      done
      cd ..
  done 
fi

if [ -d "${PROVISION_FOLDER}/blueprints/" ]; then
  cd ${PROVISION_FOLDER}/blueprints
  PROVIDERS=$(ls)
  rm -f /logs/${ID}/${USECASE}/unprovision.log
  rm -f /logs/${ID}/${USECASE}/provision.log
    
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
      
    echo "Provisioning on ${PROVIDER}"
    cd ${PROVIDER}
    mkdir -p /logs/${ID}/${USECASE}/
    DATE=$(date +%Y-%m-%d-%H-%M-%S)
    echo "Provision started at ${DATE} on ${PROVIDER}"
    /usr/local/bin/terraform init
    echo ${EXTRAVARS}
    for TF_VAR in ${EXTRAVARS}; do
      export ${TF_VAR}
    done
    /usr/local/bin/terraform apply ${VARS} -auto-approve 2>&1 | tee -a /logs/${ID}/${USECASE}/provision.log
    DATE=$(date +%Y-%m-%d-%H-%M-%S)
    echo "Provision finished at ${DATE} on ${PROVIDER}"
    cd -
  done
fi