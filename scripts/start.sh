#!/bin/bash

set -e  # Exit on error
set -o pipefail  # Catch errors in piped commands

# Check if NVM is installed, if not install it
if ! command -v nvm &> /dev/null; then
    echo "🔧 Installing NVM (Node Version Manager)..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
fi

# Load NVM if available
export NVM_DIR="/root/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && source "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && source "$NVM_DIR/bash_completion"

# Check if Node.js is installed, if not install it
if ! command -v npm &> /dev/null; then
    echo "🔧 Installing Node.js..."
    nvm install 22
    npm install -g npm@11.4.2
fi

# Install root-level dependencies
echo "📦 Installing root npm dependencies..."
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
pushd src/frontend/ > /dev/null
npm install
popd > /dev/null

# Build frontend for DFX
echo "🔨 Building frontend for DFX..."
pushd src/frontend/ > /dev/null
npm run build:dfx
popd > /dev/null

# Cleanup old dfx local network state
echo "🧹 Cleaning up old DFX network state..."
rm -rf /app/.dfx/network/local/pid
rm -rf /app/.dfx/network/local/pocket-ic-pid

# Install dfx if not present
if ! command -v dfx &> /dev/null; then
    if ! command -v dfxvm &> /dev/null; then
        echo "🔧 Installing DFX (Internet Computer SDK)..."
        wget https://github.com/dfinity/sdk/releases/download/0.28.0/dfx-0.28.0-x86_64-linux.tar.gz
        tar -xf dfx-0.28.0-x86_64-linux.tar.gz
        mv dfx /usr/local/bin/dfx
        rm -f dfx-0.28.0-x86_64-linux.tar.gz
    else
        echo "🔧 Installing DFX using dfxvm..."
        dfxvm install 0.28.0
    fi
    
fi

# Restart local DFX network
echo "🚀 Starting DFX local network..."
dfx stop || true
dfx start --clean --background

# Setup and deploy identity
echo "👤 Setting up DFX identity..."
dfx identity new staging --storage-mode=plaintext || echo "ℹ️ Identity 'staging' already exists."
dfx identity use staging

# Deploy the project
echo "🚀 Deploying canisters..."
dfx deploy

while true; do
    git pull origin main || true
    npm install || true
    pushd src/frontend/ > /dev/null
    npm install || true
    popd > /dev/null
    dfx deploy
    sleep 5
    bash scripts/setup-s3.sh || true
    echo "🌐 Starting frontend..."
    pushd src/frontend/ > /dev/null
    timeout 2700 npm start || true
    popd > /dev/null
done
