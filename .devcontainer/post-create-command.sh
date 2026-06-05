#!/bin/bash

LOG_FILE=post-create-command.sh.log

rm -Rf $LOG_FILE

touch $LOG_FILE

echo "post-create-command.sh $(date) - start" >> $LOG_FILE

echo "post-create-command.sh $(date) - sudo apt update" >> $LOG_FILE
sudo apt-get update >> $LOG_FILE

echo "post-create-command.sh $(date) - sudo apt install git-lfs" >> $LOG_FILE
sudo apt-get install git-lfs >> $LOG_FILE

echo "post-create-command.sh $(date) - git lfs install" >> $LOG_FILE
git lfs install >> $LOG_FILE

echo "post-create-command.sh $(date) - git lfs pull" >> $LOG_FILE
git lfs pull >> $LOG_FILE

echo "post-create-command.sh $(date) - npm install" >> $LOG_FILE
npm install >> $LOG_FILE

echo "post-create-command.sh $(date) - npm run vendor" >> $LOG_FILE
npm run vendor >> $LOG_FILE

echo "post-create-command.sh $(date) - go gum@v0.17.0" >> $LOG_FILE
go install github.com/charmbracelet/gum@v0.17.0 >> $LOG_FILE

echo "post-create-command.sh $(date) - cp SALVARE" >> $LOG_FILE
cp .devcontainer/SALVARE /home/codespace/.local/bin/SALVARE
ls -la $(which SALVARE) >> $LOG_FILE

echo "post-create-command.sh $(date) - nvm install.sh " >> $LOG_FILE
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.5/install.sh | bash >> $LOG_FILE
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

echo "post-create-command.sh $(date) - nvm install " >> $LOG_FILE
nvm install >> $LOG_FILE

echo "post-create-command.sh $(date) - nvm use " >> $LOG_FILE
nvm use >> $LOG_FILE

echo "post-create-command.sh $(date) - node --version " >> $LOG_FILE
node --version >> $LOG_FILE

echo "post-create-command.sh $(date) - end" >> $LOG_FILE
