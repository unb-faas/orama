#!/bin/bash
ID=$1
USECASE=$2
DIR="/use-cases/${USECASE}"
PROVISION_FOLDER="/provisions/${ID}/"

if [ -d "${PROVISION_FOLDER}" ]; then
    rsync -azh ${DIR} ${PROVISION_FOLDER} > /dev/null
    echo "false"
else 
    mkdir -p ${PROVISION_FOLDER}
    rsync -azh ${DIR} ${PROVISION_FOLDER} > /dev/null
    echo "true"
fi
