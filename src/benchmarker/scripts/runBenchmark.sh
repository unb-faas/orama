#!/bin/bash

BENCHMARK_FILE=$1
ID=$2
PROVIDER=$3
URL=$4
URL_PATH=$5
CONCURRENCE=$6
REPETITION=$7
mkdir -p /results/${ID}/${PROVIDER}/${CONCURRENCE}/${REPETITION}

jmeter -n -t ${BENCHMARK_FILE} \
    -Jid=${id} \
    -Jprovider=${PROVIDER} \
    -Jurl=${URL} \
    -Jurl_path=${URL_PATH} \
    -Jconcurrence=${CONCURRENCE} \
    -Jrepetition=${REPETITION}