#!/bin/bash

# S3 Configuration Setup Script
# 
# This script automatically configures S3 settings for the OriginStamp ICP backend canister.
# It reads S3 credentials from the .env file and applies them to the deployed canister.
#
# Prerequisites:
# 1. For local: DFX must be running (dfx start --background)
# 2. Backend canister must be deployed (dfx deploy backend [--network ic])
# 3. .env file must exist with S3 credentials
#
# Required environment variables in .env:
# - S3_ACCESS_KEY      : AWS/S3 access key
# - S3_SECRET_KEY      : AWS/S3 secret key  
# - S3_REGION          : AWS/S3 region (e.g., ap-southeast-1)
# - S3_BUCKET_NAME     : S3 bucket name
#
# Optional environment variables:
# - S3_ENDPOINT        : Custom S3 endpoint for S3-compatible services
#
# Usage:
#   ./scripts/setup-s3.sh [network]
#
# Parameters:
#   network   : Target network (local|ic). Default: local
#
# Examples:
#   # Setup with AWS S3 on local network (default)
#   ./scripts/setup-s3.sh
#   ./scripts/setup-s3.sh local
#
#   # Setup with AWS S3 on IC mainnet
#   ./scripts/setup-s3.sh ic
#
#   # Setup with custom S3-compatible endpoint on local
#   # (uncomment S3_ENDPOINT in .env first)
#   ./scripts/setup-s3.sh local

set -e

# Parse command line arguments
NETWORK="${1:-local}"  # Default to local if no argument provided

# Validate network parameter
if [[ "$NETWORK" != "local" && "$NETWORK" != "ic" ]]; then
    echo "❌ Invalid network parameter: $NETWORK"
    echo "💡 Valid options: local, ic"
    echo "💡 Usage: $0 [local|ic]"
    exit 1
fi

echo "=== Setting up S3 Configuration for $NETWORK network ==="

# Function to check if dfx is running (only for local network)
check_dfx() {
    if [[ "$NETWORK" == "local" ]]; then
        if ! dfx ping >/dev/null 2>&1; then
            echo "❌ DFX is not running. Please start it first:"
            echo "   dfx start --background"
            exit 1
        fi
        echo "✅ DFX is running locally"
    else
        echo "📡 Using IC mainnet - no local DFX required"
    fi
}

# Function to safely load environment variables
load_env() {
    if [ -f .env ]; then
        set -a  # automatically export all variables
        source .env
        set +a  # stop automatically exporting
        echo "✅ Environment variables loaded from .env"
    else
        echo "❌ .env file not found. Please create one with S3 credentials."
        echo "💡 Required variables: S3_ACCESS_KEY, S3_SECRET_KEY, S3_REGION, S3_BUCKET_NAME"
        echo "💡 Optional variables: S3_ENDPOINT"
        exit 1
    fi
}

# Function to validate required environment variables
validate_env() {
    local required_vars=("S3_ACCESS_KEY" "S3_SECRET_KEY" "S3_REGION" "S3_BUCKET_NAME")
    local missing_vars=()
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            missing_vars+=("$var")
        fi
    done
    
    if [ ${#missing_vars[@]} -ne 0 ]; then
        echo "❌ Missing required environment variables:"
        for var in "${missing_vars[@]}"; do
            echo "   - $var"
        done
        exit 1
    fi
    
    echo "✅ All required S3 environment variables are set"
}

# Check prerequisites
check_dfx
load_env
validate_env

# S3_ENDPOINT is optional
if [ -n "$S3_ENDPOINT" ] && [ "$S3_ENDPOINT" != "" ]; then
    echo "📍 Custom S3 endpoint configured: $S3_ENDPOINT"
else
    echo "📍 Using default AWS S3 endpoint"
fi

# Get canister ID for backend
echo "🔍 Getting backend canister ID for $NETWORK network..."
if [[ "$NETWORK" == "ic" ]]; then
    echo "   Executing: dfx canister id backend --network ic"
    if BACKEND_CANISTER_ID=$(dfx canister id backend --network ic 2>&1); then
        echo "   Success: Got canister ID: $BACKEND_CANISTER_ID"
    else
        echo "❌ Backend canister not deployed yet on IC network. Deploy first, then run this script."
        echo "💡 Run: dfx deploy backend --network ic"
        echo "   Error output: $BACKEND_CANISTER_ID"
        exit 1
    fi
    NETWORK_FLAG="--network ic"
else
    echo "   Executing: dfx canister id backend --network local"
    if BACKEND_CANISTER_ID=$(dfx canister id backend --network local 2>&1); then
        echo "   Success: Got canister ID: $BACKEND_CANISTER_ID"
    else
        echo "❌ Backend canister not deployed yet on local network. Deploy first, then run this script."
        echo "💡 Run: dfx deploy backend --network local"
        echo "   Error output: $BACKEND_CANISTER_ID"
        exit 1
    fi
    NETWORK_FLAG="--network local"
fi

# Validate canister ID format
if [[ ! "$BACKEND_CANISTER_ID" =~ ^[a-z0-9-]{5}-[a-z0-9-]{5}-[a-z0-9-]{5}-[a-z0-9-]{5}-[a-z0-9-]{3}$ ]]; then
    echo "❌ Invalid canister ID format: $BACKEND_CANISTER_ID"
    echo "💡 Please ensure the backend canister is properly deployed"
    exit 1
fi

echo "🔧 Configuring S3 for backend canister: $BACKEND_CANISTER_ID on $NETWORK network"

# Check current S3 configuration status
echo "📋 Checking current S3 configuration status..."
if CURRENT_STATUS=$(dfx canister call backend get_s3_config_status $NETWORK_FLAG 2>&1); then
    echo "   Current status: $CURRENT_STATUS"
else
    echo "   Could not check current status (canister may not have this method yet)"
    CURRENT_STATUS="false"
fi

# Configure S3 settings in the canister with proper endpoint handling
echo "⚙️  Applying S3 configuration..."

# Prepare S3 configuration command
if [ -n "$S3_ENDPOINT" ] && [ "$S3_ENDPOINT" != "" ]; then
    # Use custom endpoint
    echo "   Using custom S3 endpoint: $S3_ENDPOINT"
    S3_CONFIG_CMD="dfx canister call backend configure_s3 '(record {
        access_key_id = \"$S3_ACCESS_KEY\";
        secret_access_key = \"$S3_SECRET_KEY\";
        region = \"$S3_REGION\";
        endpoint = opt \"$S3_ENDPOINT\";
        bucket_name = \"$S3_BUCKET_NAME\";
    })' $NETWORK_FLAG"
else
    # Use null endpoint for AWS S3
    echo "   Using AWS S3 default endpoint"
    S3_CONFIG_CMD="dfx canister call backend configure_s3 '(record {
        access_key_id = \"$S3_ACCESS_KEY\";
        secret_access_key = \"$S3_SECRET_KEY\";
        region = \"$S3_REGION\";
        endpoint = null;
        bucket_name = \"$S3_BUCKET_NAME\";
    })' $NETWORK_FLAG"
fi

# Execute S3 configuration
echo "   Executing configuration command..."
if eval "$S3_CONFIG_CMD"; then
    echo "✅ S3 configuration command executed successfully!"
else
    echo "❌ Failed to configure S3"
    echo "💡 Command that failed: $S3_CONFIG_CMD"
    if [[ "$NETWORK" == "ic" ]]; then
        echo "💡 Note: IC mainnet operations may require sufficient cycles in your wallet"
    fi
    exit 1
fi

# Provide summary of configuration
echo "✅ S3 configuration completed successfully!"
echo "   - Network: $NETWORK"
echo "   - Canister ID: $BACKEND_CANISTER_ID"
echo "   - Access Key: ${S3_ACCESS_KEY:0:8}***"
echo "   - Region: $S3_REGION"
if [ -n "$S3_ENDPOINT" ] && [ "$S3_ENDPOINT" != "" ]; then
    echo "   - Endpoint: $S3_ENDPOINT"
else
    echo "   - Endpoint: AWS S3 (default)"
fi
echo "   - Bucket: $S3_BUCKET_NAME"

# Verify configuration was applied
echo "🔍 Verifying S3 configuration..."
if NEW_STATUS=$(dfx canister call backend get_s3_config_status $NETWORK_FLAG 2>&1); then
    if [ "$NEW_STATUS" = "(true)" ]; then
        echo "✅ S3 configuration verified successfully!"
        
        # Test upload URL generation
        echo "🧪 Testing upload URL generation..."
        if TEST_RESULT=$(dfx canister call backend generate_upload_url '("test-session", record { filename="test.jpg"; content_type="image/jpeg"; file_size=1024 })' $NETWORK_FLAG 2>&1); then
            if [[ "$TEST_RESULT" == *"Ok"* ]]; then
                echo "✅ Upload URL generation test passed!"
            else
                echo "⚠️  Upload URL generation test failed: $TEST_RESULT"
                echo "💡 Configuration is saved but upload functionality may need debugging"
            fi
        else
            echo "⚠️  Upload URL generation test failed: $TEST_RESULT"
            if [[ "$NETWORK" == "ic" ]]; then
                echo "💡 Note: On IC mainnet, some operations may take longer or require cycles"
            fi
        fi
    else
        echo "⚠️  S3 configuration verification failed: $NEW_STATUS"
        echo "💡 Configuration may have been saved but is not properly active"
    fi
else
    echo "⚠️  Could not verify S3 configuration: $NEW_STATUS"
    echo "💡 Configuration may have been saved but verification method is not available"
fi

echo "=== S3 Configuration Complete for $NETWORK network ==="
