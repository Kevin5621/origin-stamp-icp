#!/bin/bash

# Automated Deploy Script with S3 Configuration
# This script deploys canisters and automatically sets up S3 configuration

set -e

echo "🚀 Starting automated deployment with S3 configuration..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please create one with S3 credentials."
    exit 1
fi

# Source environment variables
export $(cat .env | grep -v '^#' | xargs)

echo "📦 Deploying canisters..."

# Deploy backend canister
dfx deploy backend --network local

if [ $? -ne 0 ]; then
    echo "❌ Backend deployment failed"
    exit 1
fi

echo "✅ Backend canister deployed successfully"

# Deploy frontend canister
dfx deploy frontend --network local

if [ $? -ne 0 ]; then
    echo "❌ Frontend deployment failed"
    exit 1
fi

echo "✅ Frontend canister deployed successfully"

# Wait a moment for canister to be ready
sleep 2

echo "🔧 Configuring S3 automatically..."

# Run S3 setup script
./scripts/setup-s3.sh

if [ $? -eq 0 ]; then
    echo "🎉 Deployment and S3 configuration completed successfully!"
    echo ""
    echo "Your application is ready:"
    echo "  - Backend Canister ID: $(dfx canister id backend)"
    echo "  - Frontend Canister ID: $(dfx canister id frontend)"
    echo "  - Frontend URL: http://localhost:4943/?canisterId=$(dfx canister id frontend)"
    echo "  - S3 Bucket: $S3_BUCKET_NAME"
    echo ""
else
    echo "❌ S3 configuration failed, but canisters are deployed"
    echo "You can run './scripts/setup-s3.sh' manually to configure S3"
    exit 1
fi
