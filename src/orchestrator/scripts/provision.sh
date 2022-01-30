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
          zip -r ${FAAS}.zip * >> /dev/null
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
      
    echo "Provisioning on ${PROVIDER}"
    cd ${PROVIDER}
    mkdir -p /logs/${ID}/${USECASE}/
    DATE=$(date +%Y-%m-%d-%H-%M-%S)
    echo "Provision started at ${DATE} on ${PROVIDER}"
    /usr/local/bin/terraform init
    echo ${EXTRAVARS}
    /usr/local/bin/terraform apply ${VARS} ${EXTRAVARS} -auto-approve 2>&1 | tee -a /logs/${ID}/${USECASE}/provision.log
    DATE=$(date +%Y-%m-%d-%H-%M-%S)
    echo "Provision finished at ${DATE} on ${PROVIDER}"
    cd -
  done
fi
