#!/bin/bash

LOG_FILE=post-create-command.sh.log

rm -Rf $LOG_FILE

touch $LOG_FILE

echo "post-create-command.sh $(date) - start" >> $LOG_FILE

echo "post-create-command.sh $(date) - npm install" >> $LOG_FILE
npm install >> $LOG_FILE

echo "post-create-command.sh $(date) - npm run vendor" >> $LOG_FILE
npm run vendor >> $LOG_FILE

echo "post-create-command.sh $(date) - end" >> $LOG_FILE
