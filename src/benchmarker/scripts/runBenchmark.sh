#!/bin/bash
BENCHMARK_FILE=${1}
ID=${2}
PROVIDER=${3}
PROTOCOL=${4}
URL=${5}
PORT=${6}
URL_PATH=${7}
CONCURRENCE=${8}
REPETITION=${9}
METHOD=${10}
A=${11}
B=${12}
C=${13}
D=${14}
E=${15}
OPERATION=${16}
BODY="${17}"
mkdir -p /results/${ID}/${PROVIDER}/${CONCURRENCE}/${REPETITION}

jmeter -n -t ${BENCHMARK_FILE} \
    -Jid=${ID} \
    -Jprovider=${PROVIDER} \
    -Jprotocol=${PROTOCOL} \
    -Jurl=${URL} \
    -Jport=${PORT} \
    -Jurl_path=${URL_PATH} \
    -Jconcurrence=${CONCURRENCE} \
    -Jrepetition=${REPETITION} \
    -Jmethod=${METHOD} \
    -Ja=${A} \
    -Jb=${B} \
    -Jc=${C} \
    -Jd=${D} \
    -Je=${E} \
    -Joperation=${OPERATION} \
    -Jbody=${BODY} 