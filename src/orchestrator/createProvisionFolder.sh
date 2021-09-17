#!/bin/bash
ID=$1
USECASE=$2
DIR="/use-cases/${USECASE}"
PROVISION_FOLDER="/provisions/${ID}/"

if [ -d "${PROVISION_FOLDER}" ]; then
    echo "false"
else 
    mkdir -p ${PROVISION_FOLDER}
    cp -r ${DIR} ${PROVISION_FOLDER}
    echo "true"
fi
