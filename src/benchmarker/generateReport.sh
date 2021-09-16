#!/bin/bash
# Example:
# - ./generateReport.sh data.csv reportFolder
jmeter -g $1 -o /reports/$2
