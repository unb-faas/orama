#!/bin/bash
# Example:
# - ./runBenchmarck.sh www.google.com gcp 5 10
jmeter -n -t benchmark.jmx \
    -Jurl=$1 \
    -Jprovider=$2 \
    -Jrepetition=$3 \
    -Jconcurrence=$4