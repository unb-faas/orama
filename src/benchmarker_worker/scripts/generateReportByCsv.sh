#!/bin/bash
UUID=$1
mkdir -p /reports/${UUID}
jmeter -g /csvs/${UUID}.csv -o /reports/${UUID}
echo "true"
