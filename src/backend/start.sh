#/bin/bash
#  ____               __     __               _ _         
# |  _ \  ___  ___ _ _\ \   / /_ _  ___ _   _(_) |_ _   _ 
# | | | |/ _ \/ _ \ '_ \ \ / / _` |/ __| | | | | __| | | |
# | |_| |  __/  __/ |_) \ V / (_| | (__| |_| | | |_| |_| |
# |____/ \___|\___| .__/ \_/ \__,_|\___|\__,_|_|\__|\__, |
#                 |_|                               |___/ 
#
# Description: Script to start up a service inside a Docker container
# Date: 2020-10-14
# University of Brasilia
# Parameters defined outside container:
# - MEMORY_SIZE: max amount of memory (GB) alowed to be alocated by this container
# 
# Take care to define the right place to /var/log volume when start up the container
# in order to make those files readible by the application.  
#-----------------------------------------------------------------------------------
SERVICE=backend
MEMORY_SIZE_MAX=16
if [ -z "$MEMORY_SIZE" ]; then
   MEMORY_LEAK=`expr 1024 \* $MEMORY_SIZE_MAX`
else
  MEMORY_LEAK=`expr 1024 \* $MEMORY_SIZE`
fi
cd /var/www

if [ "${EXEC_MIGRATION}" = "yes" ]; then
  echo "Executing database migration..."
  attemps=0
  while : ; do
    knex migrate:latest     
    RES=$?
    if [ ${RES} -eq 0 ]; then 
      break    
    fi
    attemps=$((attemps + 1))
    echo "Trying database migration again... [${attemps}]"
    sleep 1
  done
fi

if [ "${EXEC_SEED}" = "yes" ]; then
  knex seed:run
fi

if [ -d "/var/log/$SERVICE" ]; then
  echo "Directory "/var/log/$SERVICE" exists."
else
  mkdir /var/log/$SERVICE
  echo "Directory "/var/log/$SERVICE" created."
fi
LOGFILE=$(echo "/var/log/${SERVICE}/`date +%Y%m%d`.log")
export NODE_OPTIONS="--max-old-space-size=${MEMORY_LEAK}" ; npm start 2>&1 | tee -a $LOGFILE