#!/bin/bash

set -e  # Exit on error
set -o pipefail  # Catch errors in piped commands

# Check if NVM is installed, if not install it
if ! command -v nvm &> /dev/null; then
    echo "🔧 Installing NVM (Node Version Manager)..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
fi

# Load NVM if available
export NVM_DIR="$HOME/.nvm"
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
rm -rf .dfx/network/local/pid
rm -rf .dfx/network/local/pocket-ic-pid

# Install dfx if not present
if ! command -v dfx &> /dev/null; then
    if ! command -v dfxvm &> /dev/null; then
        echo "🔧 Installing DFX (Internet Computer SDK)..."
        wget https://github.com/dfinity/sdk/releases/download/0.29.1/dfx-0.29.1-x86_64-linux.tar.gz
        tar -xf dfx-0.29.1-x86_64-linux.tar.gz
        mv dfx /usr/local/bin/dfx
        rm -f dfx-0.29.1-x86_64-linux.tar.gz
    else
        echo "🔧 Installing DFX using dfxvm..."
        dfxvm install 0.29.1
    fi
    
fi

# Restart local DFX network
echo "🚀 Starting DFX local network..."
dfx stop || true
dfx start --host 127.0.0.1:8080 --background

# Setup and deploy identity
echo "👤 Setting up DFX identity..."
dfx identity new staging --storage-mode=plaintext || echo "ℹ️ Identity 'staging' already exists."
dfx identity use staging

# Deploy the project
echo "🚀 Deploying canisters..."
dfx deploy

# Setup S3 configuration
echo "☁️ Setting up S3 configuration..."
bash scripts/setup-s3.sh || echo "⚠️ S3 setup failed, continuing..."

# Setup AI Verification Worker
echo "🤖 Setting up AI Verification Worker..."
pushd services/ai-verification-worker/ > /dev/null
if [ ! -d "venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python3 -m venv venv
fi
source venv/bin/activate
pip install -r requirements.txt || true

# Start AI worker in background with auto-restart
echo "🚀 Starting AI Verification Worker (background)..."

# Function to start worker
start_ai_worker() {
    nohup python3 ai_verification_worker.py > ai_verification_worker.log 2>&1 &
    echo $! > ai_verification_worker.pid
    echo "✅ AI Worker started with PID $(cat ai_verification_worker.pid)"
}

# Function to check if worker is running
is_worker_running() {
    if [ -f "ai_verification_worker.pid" ]; then
        local pid=$(cat ai_verification_worker.pid)
        ps -p $pid > /dev/null 2>&1
    else
        false
    fi
}

# Start worker initially
start_ai_worker

# Start monitoring in background
(
    while true; do
        sleep 30
        if ! is_worker_running; then
            echo "🔄 AI Worker not running, restarting..."
            start_ai_worker
        fi
    done
) &
echo $! > ai_worker_monitor.pid
echo "📡 AI Worker monitor started with PID $(cat ai_worker_monitor.pid)"
popd > /dev/null

echo "🌐 Starting frontend development server..."
pushd src/frontend/ > /dev/null
npm run dev
popd > /dev/null
