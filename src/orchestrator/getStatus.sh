#!/bin/bash

#--------------------------
# 0 - INITIAL
# 1 - PROVISION RUNNING
# 2 - PROVISION FINISHED
# 3 - UNPROVISION RUNNING
# 4 - UNPROVISION FINISHED
# 5 - ERROR ON PROVISION
# 6 - ERROR ON UNPROVISION
#---------------------------

ID=$1
USECASE=$2
PROVISION_LOGFILE=/logs/${ID}/${USECASE}/provision.log
UNPROVISION_LOGFILE=/logs/${ID}/${USECASE}/unprovision.log
STATUS=0
PROVIDERS=$(ls /use-cases/${USECASE}/blueprints | wc -l)

if [ -f ${UNPROVISION_LOGFILE} ]; then
    STATUS=3
    if [ $(cat ${UNPROVISION_LOGFILE} | grep "Destroy complete!" | wc -l) -eq ${PROVIDERS} ]; then
        STATUS=4
    else
        if [ $(cat ${UNPROVISION_LOGFILE} | grep "Error: " | wc -l) -gt 0 ]; then
            ERROR_UNPROVISION=$(cat ${UNPROVISION_LOGFILE} | grep "Error: " | sed -e 's/"//g' |  awk -F'Error: ' '{print $2}' | sed -r "s/\x1B\[([0-9]{1,3}(;[0-9]{1,2})?)?[mGK]//g" | sed -e 's/\^\[\[//g' | tr '\n' ' ' )
            STATUS=6
        fi
    fi
else
    if [ -f ${PROVISION_LOGFILE} ]; then
        STATUS=1
        if [ $(cat ${PROVISION_LOGFILE} | grep "Apply complete!" | wc -l) -eq ${PROVIDERS} ]; then
            STATUS=2
        else
            if [ $(cat ${PROVISION_LOGFILE} | grep "Error: " | wc -l) -gt 0 ]; then
                ERROR_PROVISION=$(cat ${PROVISION_LOGFILE} | grep "Error: " | sed -e 's/"//g' | awk -F'Error: ' '{print $2}' | sed -r "s/\x1B\[([0-9]{1,3}(;[0-9]{1,2})?)?[mGK]//g" | sed -e 's/\^\[\[//g' | tr '\n' ' ' )
                STATUS=5
            fi
        fi
    fi
fi

case $STATUS in
0) DESC="Initial" ;;
1) DESC="Provision running" ;;
2) DESC="Provision finished" ;;
3) DESC="Unrovision running" ;;
4) DESC="Unprovision finished" ;;
5) DESC="Error on provision" ;;
6) DESC="Error on unprovision" ;;
*) DESC="Unknown" ;;
esac

echo "{"
echo "\"status_desc\":\"${DESC}\","
echo "\"status\":\"${STATUS}\""
if [ "${ERROR_PROVISION}" != "" ];then
    echo ",\"provision_error\":\"${ERROR_PROVISION}\""
fi
if [ "${ERROR_UNPROVISION}" != "" ];then
    echo ",\"unprovision_error\":\"${ERROR_UNPROVISION}\""
fi
echo "}"