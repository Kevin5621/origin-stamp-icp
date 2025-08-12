#!/bin/bash

# Test ICRC-7 NFT Functionality
echo "=== ICRC-7 NFT Test ==="

BACKEND_CANISTER_ID="bkyz2-fmaaa-aaaaa-qaaaq-cai"
TEST_USER_PRINCIPAL="rdmx6-jaaaa-aaaaa-aaadq-cai"  # Example principal

echo "1. Getting collection metadata..."
dfx canister call $BACKEND_CANISTER_ID icrc7_collection_metadata

echo "2. Getting collection name..."
dfx canister call $BACKEND_CANISTER_ID icrc7_name

echo "3. Getting collection description..."
dfx canister call $BACKEND_CANISTER_ID icrc7_description

echo "4. Getting total supply..."
dfx canister call $BACKEND_CANISTER_ID icrc7_total_supply

echo "5. Creating a test session for NFT minting..."
SESSION_RESULT=$(dfx canister call $BACKEND_CANISTER_ID create_physical_art_session '("testartist", "Digital Sunrise", "A beautiful digital artwork representing the dawn of a new era")')
echo "Session created: $SESSION_RESULT"

# Extract session ID
SESSION_ID=$(echo "$SESSION_RESULT" | grep -o '"[^"]*"' | tr -d '"' | head -1)

if [ -n "$SESSION_ID" ]; then
    echo "Extracted Session ID: $SESSION_ID"
    
    echo "6. Adding some photos to the session..."
    dfx canister call $BACKEND_CANISTER_ID upload_photo_to_session "(\"$SESSION_ID\", \"https://example.com/sunrise1.jpg\")"
    dfx canister call $BACKEND_CANISTER_ID upload_photo_to_session "(\"$SESSION_ID\", \"https://example.com/sunrise2.jpg\")"
    
    echo "7. Minting NFT from session..."
    MINT_RESULT=$(dfx canister call $BACKEND_CANISTER_ID mint_nft_from_session "(
        \"$SESSION_ID\",
        record {
            owner = principal \"$TEST_USER_PRINCIPAL\";
            subaccount = null
        },
        vec {
            record { \"rarity\"; \"rare\" };
            record { \"medium\"; \"digital\" };
            record { \"edition\"; \"1/1\" }
        }
    )")
    echo "Mint result: $MINT_RESULT"
    
    # Extract token ID from mint result
    TOKEN_ID=$(echo "$MINT_RESULT" | grep -o '[0-9]\+' | head -1)
    
    if [ -n "$TOKEN_ID" ]; then
        echo "Extracted Token ID: $TOKEN_ID"
        
        echo "8. Getting token details..."
        dfx canister call $BACKEND_CANISTER_ID get_token_details "($TOKEN_ID)"
        
        echo "9. Getting token metadata..."
        dfx canister call $BACKEND_CANISTER_ID icrc7_token_metadata "(vec { $TOKEN_ID })"
        
        echo "10. Getting token owner..."
        dfx canister call $BACKEND_CANISTER_ID icrc7_owner_of "(vec { $TOKEN_ID })"
        
        echo "11. Getting user's token balance..."
        dfx canister call $BACKEND_CANISTER_ID icrc7_balance_of "(vec { record { owner = principal \"$TEST_USER_PRINCIPAL\"; subaccount = null } })"
        
        echo "12. Getting tokens owned by user..."
        dfx canister call $BACKEND_CANISTER_ID icrc7_tokens_of "(record { owner = principal \"$TEST_USER_PRINCIPAL\"; subaccount = null }, null, null)"
        
        echo "13. Getting user's NFTs (custom function)..."
        dfx canister call $BACKEND_CANISTER_ID get_user_nfts "(principal \"$TEST_USER_PRINCIPAL\")"
        
        echo "14. Getting session NFTs..."
        dfx canister call $BACKEND_CANISTER_ID get_session_nfts "(\"$SESSION_ID\")"
        
        echo "15. Getting all tokens in collection..."
        dfx canister call $BACKEND_CANISTER_ID icrc7_tokens "(null, opt 10)"
        
        echo "16. Checking total supply after minting..."
        dfx canister call $BACKEND_CANISTER_ID icrc7_total_supply
        
    else
        echo "Failed to extract token ID from mint result: $MINT_RESULT"
    fi
else
    echo "Failed to extract session ID from: $SESSION_RESULT"
fi

echo "=== NFT Test Complete ==="
