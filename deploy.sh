#!/bin/bash

# Configurações do servidor
SERVER_USER="root"
SERVER_HOST="86.48.2.187"
SERVER_PATH="/home/deploy/api-rosarial-dev"
PM2_APP_NAME="api-rosarial"
DEPLOY_USER="deploy"

# Comandos para atualizar o projeto
SSH_COMMANDS="

  cd $SERVER_PATH &&
  git config --global --add safe.directory $SERVER_PATH &&
  git pull origin main &&
  npm install &&
  sudo -u $DEPLOY_USER bash -c '
  pm2 restart $PM2_APP_NAME
  '
"

# Executa os comandos no servidor
ssh ${SERVER_USER}@${SERVER_HOST} "$SSH_COMMANDS"
