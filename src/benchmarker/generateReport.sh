#!/bin/bash
# Example:
# - ./generateReport.sh data.csv reportFolder
jmeter -g /results/$1 -o /reports/$2
