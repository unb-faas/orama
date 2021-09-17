#!/bin/bash
ID=$1
USECASE=$2

LOGFILE=/logs/${ID}/${USECASE}/provision.log

GET_URL=$(cat ${LOGFILE} | grep "url =" | grep "get_url" | awk -F' = ' '{print $2}' | sed -e 's/"//g' )
POST_URL=$(cat ${LOGFILE} | grep "url =" | grep "post_url" | awk -F' = ' '{print $2}' | sed -e 's/"//g')
DELETE_URL=$(cat ${LOGFILE} | grep "url =" | grep "delete_url" | awk -F' = ' '{print $2}' | sed -e 's/"//g')
PUT_URL=$(cat ${LOGFILE} | grep "url =" | grep "put_url" | awk -F' = ' '{print $2}' | sed -e 's/"//g')

echo "{"
echo "\"get\":\"${GET_URL}\","
echo "\"post\":\"${POST_URL}\","
echo "\"delete\":\"${DELETE_URL}\","
echo "\"put\":\"${PUT_URL}\""
echo "}"
