#!/bin/bash
BENCHMARK_FILE=${1}
ID=${2}
PROVIDER=${3}
URL=${4}
PORT=${5}
URL_PATH=${6}
CONCURRENCE=${7}
REPETITION=${8}
METHOD=${9}
A=${10}
B=${11}
C=${12}
D=${13}
E=${14}
OPERATION=${15}
BODY=${16}
mkdir -p /results/${ID}/${PROVIDER}/${CONCURRENCE}/${REPETITION}

jmeter -n -t ${BENCHMARK_FILE} \
    -Jid=${ID} \
    -Jprovider=${PROVIDER} \
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