#!/bin/bash

dfx identity new codespace_dev  --storage-mode=plaintext     
dfx identity use codespace_dev      
dfx start --background             
dfx stop

apt-get update && apt-get install -y jq