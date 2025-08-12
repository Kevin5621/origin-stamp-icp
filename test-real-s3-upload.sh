#!/bin/bash

# Test real S3 upload with actual file
echo "=== Testing Real S3 Upload ==="

# Check if AWS CLI is available
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI not available. Testing with backend only."
else
    echo "✅ AWS CLI available for verification"
fi

# Source environment variables
set -a
source .env
set +a

BACKEND_CANISTER_ID="bkyz2-fmaaa-aaaaa-qaaaq-cai"

echo "1. Creating test session..."
SESSION_RESULT=$(dfx canister call $BACKEND_CANISTER_ID create_physical_art_session '("testuser", "S3 Upload Test", "Testing real S3 upload")')
echo "Session result: $SESSION_RESULT"

# Extract session ID
SESSION_ID=$(echo "$SESSION_RESULT" | grep -o '"[^"]*"' | tr -d '"' | head -1)

if [ -n "$SESSION_ID" ]; then
    echo "✅ Session created: $SESSION_ID"
    
    # Create a small test image file
    echo "2. Creating test image file..."
    TEST_FILE="test-upload.txt"
    echo "This is a test file for S3 upload testing at $(date)" > $TEST_FILE
    echo "File size: $(stat -c%s $TEST_FILE) bytes"
    
    echo "3. Testing direct AWS S3 upload..."
    
    # Test key that frontend would generate
    TIMESTAMP=$(date -u +"%Y-%m-%dT%H-%M-%S")
    FILE_KEY="physical-art/$SESSION_ID/$TIMESTAMP-$TEST_FILE"
    
    echo "Generated file key: $FILE_KEY"
    
    if command -v aws &> /dev/null; then
        # Test with AWS CLI
        echo "4. Uploading with AWS CLI..."
        
        if [ -n "$S3_ENDPOINT" ] && [ "$S3_ENDPOINT" != "" ]; then
            echo "Using custom endpoint: $S3_ENDPOINT"
            aws s3 cp $TEST_FILE "s3://$S3_BUCKET_NAME/$FILE_KEY" \
              --endpoint-url "$S3_ENDPOINT" \
              --region $S3_REGION
        else
            echo "Using default AWS S3 endpoint"
            aws s3 cp $TEST_FILE "s3://$S3_BUCKET_NAME/$FILE_KEY" \
              --region $S3_REGION
        fi
        
        if [ $? -eq 0 ]; then
            echo "✅ AWS CLI upload successful!"
            
            # Generate the URL that would be used
            if [ -n "$S3_ENDPOINT" ]; then
                FILE_URL="$S3_ENDPOINT/$S3_BUCKET_NAME/$FILE_KEY"
            else
                FILE_URL="https://$S3_BUCKET_NAME.s3.$S3_REGION.amazonaws.com/$FILE_KEY"
            fi
            
            echo "File URL: $FILE_URL"
            
            echo "5. Recording upload in backend..."
            dfx canister call $BACKEND_CANISTER_ID upload_photo_to_session "(\"$SESSION_ID\", \"$FILE_URL\")"
            
            echo "6. Verifying session details..."
            dfx canister call $BACKEND_CANISTER_ID get_session_details "(\"$SESSION_ID\")"
            
        else
            echo "❌ AWS CLI upload failed!"
        fi
    else
        echo "⚠️  AWS CLI not available, skipping direct S3 test"
    fi
    
    # Cleanup
    rm -f $TEST_FILE
    
else
    echo "❌ Failed to create session"
fi

echo "=== Test Complete ==="
