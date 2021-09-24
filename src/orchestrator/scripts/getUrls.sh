#!/bin/bash
ID=$1
USECASE=$2
LOGFILE=/logs/${ID}/${USECASE}/provision.log
PROVIDERS=$(ls /use-cases/${USECASE}/blueprints)
COUNTER=$(echo ${PROVIDERS} | wc -l)
echo "{"
for PROVIDER in ${PROVIDERS}; do
    GET_URL=$(cat ${LOGFILE} | grep "url =" | grep "${PROVIDER}_get_url" | awk -F' = ' '{print $2}' | sed -e 's/"//g' )
    POST_URL=$(cat ${LOGFILE} | grep "url =" | grep "${PROVIDER}_post_url" | awk -F' = ' '{print $2}' | sed -e 's/"//g')
    DELETE_URL=$(cat ${LOGFILE} | grep "url =" | grep "${PROVIDER}_delete_url" | awk -F' = ' '{print $2}' | sed -e 's/"//g')
    PUT_URL=$(cat ${LOGFILE} | grep "url =" | grep "${PROVIDER}_put_url" | awk -F' = ' '{print $2}' | sed -e 's/"//g')
    echo "\"${PROVIDER}\":{"
        echo "\"get\":\"${GET_URL}\","
        echo "\"post\":\"${POST_URL}\","
        echo "\"delete\":\"${DELETE_URL}\","
        echo "\"put\":\"${PUT_URL}\""
    echo "}"
    COUNTER=$((COUNTER - 1))
    if [ $COUNTER -gt 0 ]; then
        echo ","
    fi
done

echo "}"
