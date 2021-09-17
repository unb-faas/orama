#!/bin/bash
# Example:
# - ./runBenchmarck.sh www.google.com / gcp 5 10
jmeter -n -t benchmark.jmx \
    -Jid=$1 \
    -Jurl=$2 \
    -Jurl_path=$3 \
    -Jconcurrence=$4 \
    -Jrepetition=$5 \
    -Jprovider=$6 \
    