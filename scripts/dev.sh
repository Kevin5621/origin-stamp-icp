#!/bin/bash

set -e  # Exit on error
set -o pipefail  # Catch errors in piped commands

echo "🚀 Starting OriginStamp Development Environment..."

# Check if dfx is running
if ! pgrep -f "dfx start" > /dev/null; then
    echo "🌐 Starting DFX local network..."
    dfx start --clean --background
    
    # Wait for dfx to be ready
    echo "⏳ Waiting for DFX to be ready..."
    sleep 10
else
    echo "✅ DFX is already running"
fi

# Deploy backend canisters
echo "🔧 Deploying backend canisters..."
dfx deploy backend

# Generate Candid types
echo "📝 Generating Candid types..."
bash ./scripts/generate-candid.sh

# Start frontend development server
echo "🌐 Starting frontend development server..."
cd src/frontend/
npm start 