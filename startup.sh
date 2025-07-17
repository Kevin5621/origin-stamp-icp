#!/bin/bash

export NVM_DIR="/root/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

npm install

rm -rf /app/.dfx/network/local/pid
rm -rf /app/.dfx/network/local/pocket-ic-pid

dfx stop
dfx start --clean --background

dfx identity new staging --storage-mode=plaintext || echo "Identity may already exist"
dfx identity use staging
dfx deploy

cd src/frontend/
npm start
