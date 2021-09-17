#!/bin/bash
DIR="/use-cases/${1}"
if [ -d "${DIR}" ]; then
    echo "true"
else 
    echo "false"
fi
