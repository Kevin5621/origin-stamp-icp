#!/bin/bash

dfx identity new codespace_dev --storage-mode=plaintext     
dfx identity use codespace_dev      
dfx start --background             
dfx stop

# Install jq for JSON parsing in scripts
apt-get update && apt-get install -y jq

# set up tool for rust formatting
rustup component add rustfmt
rustup component add clippy
