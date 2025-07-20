#!/bin/bash

# S3 Configuration Setup Script
# This script automatically configures S3 settings when deploying the canister

set -e

echo "=== Setting up S3 Configuration ==="

# Source environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
    echo "✅ Environment variables loaded from .env"
else
    echo "❌ .env file not found. Please create one with S3 credentials."
    exit 1
fi

# Check if required S3 variables are set
required_vars=("S3_ACCESS_KEY" "S3_SECRET_KEY" "S3_REGION" "S3_ENDPOINT" "S3_BUCKET_NAME")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ Required environment variable $var is not set"
        exit 1
    fi
done

echo "✅ All required S3 environment variables are set"

# Get canister ID for backend
BACKEND_CANISTER_ID=$(dfx canister id backend 2>/dev/null || echo "")

if [ -z "$BACKEND_CANISTER_ID" ]; then
    echo "❌ Backend canister not deployed yet. Deploy first, then run this script."
    exit 1
fi

echo "🔧 Configuring S3 for backend canister: $BACKEND_CANISTER_ID"

# Configure S3 settings in the canister
dfx canister call backend configure_s3 "(
    record {
        access_key_id = \"$S3_ACCESS_KEY\";
        secret_access_key = \"$S3_SECRET_KEY\";
        region = \"$S3_REGION\";
        endpoint = opt \"$S3_ENDPOINT\";
        bucket_name = \"$S3_BUCKET_NAME\";
    }
)" --network local

if [ $? -eq 0 ]; then
    echo "✅ S3 configuration completed successfully!"
    echo "   - Access Key: ${S3_ACCESS_KEY:0:8}***"
    echo "   - Region: $S3_REGION"
    echo "   - Endpoint: $S3_ENDPOINT"
    echo "   - Bucket: $S3_BUCKET_NAME"
else
    echo "❌ Failed to configure S3"
    exit 1
fi

echo "=== S3 Configuration Complete ==="
