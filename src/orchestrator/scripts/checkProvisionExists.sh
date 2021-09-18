#!/bin/bash
DIR="/provisions/${1}/${2}"
if [ -d "${DIR}" ]; then
    echo "true"
else 
    echo "false"
fi
