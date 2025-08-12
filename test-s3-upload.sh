#!/bin/bash

# Test S3 Upload Functionality
echo "=== S3 Upload Test ==="

BACKEND_CANISTER_ID="bkyz2-fmaaa-aaaaa-qaaaq-cai"

echo "1. Checking S3 configuration status..."
dfx canister call $BACKEND_CANISTER_ID get_s3_config_status

echo "2. Getting S3 configuration..."
dfx canister call $BACKEND_CANISTER_ID get_s3_config

echo "3. Configuring S3 from environment variables..."
# Handle empty endpoint (use null instead of empty string)
if [ -z "$S3_ENDPOINT" ]; then
    dfx canister call $BACKEND_CANISTER_ID configure_s3 "(record {
        bucket_name=\"$S3_BUCKET_NAME\";
        region=\"$S3_REGION\";
        access_key_id=\"$S3_ACCESS_KEY\";
        secret_access_key=\"$S3_SECRET_KEY\";
        endpoint=null
    })"
else
    dfx canister call $BACKEND_CANISTER_ID configure_s3 "(record {
        bucket_name=\"$S3_BUCKET_NAME\";
        region=\"$S3_REGION\";
        access_key_id=\"$S3_ACCESS_KEY\";
        secret_access_key=\"$S3_SECRET_KEY\";
        endpoint=opt \"$S3_ENDPOINT\"
    })"
fi

echo "4. Checking S3 configuration status after setup..."
dfx canister call $BACKEND_CANISTER_ID get_s3_config_status

echo "5. Creating a test session..."
SESSION_RESULT=$(dfx canister call $BACKEND_CANISTER_ID create_physical_art_session '("testuser", "Test Art", "Testing S3 functionality")')
echo "Session created: $SESSION_RESULT"

# Extract session ID (assuming it returns Ok("session_id"))
SESSION_ID=$(echo "$SESSION_RESULT" | grep -o '"[^"]*"' | tr -d '"' | head -1)

if [ -n "$SESSION_ID" ]; then
    echo "Extracted Session ID: $SESSION_ID"
    echo "6. Testing upload URL generation..."
    dfx canister call $BACKEND_CANISTER_ID generate_upload_url "(\"$SESSION_ID\", record { filename=\"test.jpg\"; content_type=\"image/jpeg\"; file_size=1024 })"
    
    echo "7. Testing photo upload confirmation..."
    dfx canister call $BACKEND_CANISTER_ID upload_photo_to_session "(\"$SESSION_ID\", \"https://example.com/test.jpg\")"
    
    echo "8. Getting session details..."
    dfx canister call $BACKEND_CANISTER_ID get_session_details "(\"$SESSION_ID\")"
else
    echo "Failed to extract session ID from: $SESSION_RESULT"
fi

echo "=== Test Complete ==="
