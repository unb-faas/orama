#!/bin/bash

#--------------------------
# 0 - INITIAL
# 1 - PROVISION RUNNING
# 2 - PROVISION FINISHED
# 3 - UNPROVISION RUNNING
# 4 - UNPROVISION FINISHED
#---------------------------

ID=$1
USECASE=$2
PROVISION_LOGFILE=/logs/${ID}/${USECASE}/provision.log
UNPROVISION_LOGFILE=/logs/${ID}/${USECASE}/unprovision.log
STATUS=0

if [ -f ${UNPROVISION_LOGFILE} ]; then
    STATUS=3
    if [ $(cat ${UNPROVISION_LOGFILE} | grep "Destroy complete!" | wc -l) -gt 0 ]; then
        STATUS=4
    fi
else
    if [ -f ${PROVISION_LOGFILE} ]; then
        STATUS=1
        if [ $(cat ${PROVISION_LOGFILE} | grep "Apply complete!" | wc -l) -gt 0 ]; then
            STATUS=2
        fi
    fi
fi
echo "{"
echo "\"status\":\"${STATUS}\""
echo "}"