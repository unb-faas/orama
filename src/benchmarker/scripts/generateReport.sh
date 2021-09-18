#!/bin/bash
ID=$1
PROVIDER=$2
CONCURRENCE=$3
REPETITION=$4
mkdir -p /reports/${ID}/${PROVIDER}/${CONCURRENCE}/${REPETITION}
jmeter -g /results/${ID}/${PROVIDER}/${CONCURRENCE}/${REPETITION}/result.csv -o /reports/${ID}/${PROVIDER}/${CONCURRENCE}/${REPETITION}
echo "true"
