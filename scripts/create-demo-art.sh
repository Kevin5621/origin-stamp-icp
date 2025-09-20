#!/bin/bash

# Create Demo Art Script
# Creates real art sessions and NFTs for a user

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Creating Demo Art ===${NC}"

# Check if DFX is running
if ! dfx ping 2>/dev/null; then
    echo -e "${RED}❌ DFX is not running. Please start DFX first with 'dfx start'${NC}"
    exit 1
fi

# Get user input
read -p "Enter username: " USERNAME
read -p "Enter art title: " ART_TITLE
read -p "Enter art description: " ART_DESCRIPTION
read -p "Enter photo URL (optional): " PHOTO_URL

if [ -z "$USERNAME" ] || [ -z "$ART_TITLE" ] || [ -z "$ART_DESCRIPTION" ]; then
    echo -e "${RED}❌ Username, art title, and description are required${NC}"
    exit 1
fi

echo -e "${YELLOW}Creating art session for user: $USERNAME${NC}"

# Create physical art session
echo -e "${BLUE}1. Creating art session...${NC}"
SESSION_RESULT=$(dfx canister call backend create_physical_art_session "(\"$USERNAME\", \"$ART_TITLE\", \"$ART_DESCRIPTION\")" --output json)

if echo "$SESSION_RESULT" | grep -q '"Ok"'; then
    SESSION_ID=$(echo "$SESSION_RESULT" | grep -o '"Ok":"[^"]*"' | cut -d'"' -f4)
    echo -e "${GREEN}✅ Art session created with ID: $SESSION_ID${NC}"
else
    echo -e "${RED}❌ Failed to create art session${NC}"
    echo "$SESSION_RESULT"
    exit 1
fi

# Add photo if provided
if [ -n "$PHOTO_URL" ]; then
    echo -e "${BLUE}2. Adding photo to session...${NC}"
    PHOTO_RESULT=$(dfx canister call backend upload_photo_to_session "(\"$SESSION_ID\", \"$PHOTO_URL\")" --output json)
    
    if echo "$PHOTO_RESULT" | grep -q '"Ok"'; then
        echo -e "${GREEN}✅ Photo added to session${NC}"
    else
        echo -e "${YELLOW}⚠️  Photo upload failed${NC}"
    fi
fi

# Update session status to completed
echo -e "${BLUE}3. Updating session status...${NC}"
STATUS_RESULT=$(dfx canister call backend update_session_status "(\"$SESSION_ID\", \"completed\")" --output json)

if echo "$STATUS_RESULT" | grep -q '"Ok"'; then
    echo -e "${GREEN}✅ Session status updated to completed${NC}"
else
    echo -e "${YELLOW}⚠️  Status update failed${NC}"
fi

# Mint NFT from session
echo -e "${BLUE}4. Minting NFT from session...${NC}"
# Create a demo account for the user
ACCOUNT_PRINCIPAL="2vxsx-fae"  # Anonymous principal for demo

MINT_RESULT=$(dfx canister call backend mint_nft_from_session "(\"$SESSION_ID\", record { owner = principal \"$ACCOUNT_PRINCIPAL\"; subaccount = null; }, vec { record { \"title\"; \"$ART_TITLE\" }; record { \"description\"; \"$ART_DESCRIPTION\" }; record { \"creator\"; \"$USERNAME\" } })" --output json)

if echo "$MINT_RESULT" | grep -q '"Ok"'; then
    TOKEN_ID=$(echo "$MINT_RESULT" | grep -o '"Ok":[0-9]*' | cut -d':' -f2)
    echo -e "${GREEN}✅ NFT minted with Token ID: $TOKEN_ID${NC}"
else
    echo -e "${YELLOW}⚠️  NFT minting failed${NC}"
    echo "$MINT_RESULT"
fi

# List NFT for sale
echo -e "${BLUE}5. Listing NFT for sale...${NC}"
if [ -n "$TOKEN_ID" ]; then
    LIST_RESULT=$(dfx canister call backend list_nft "($TOKEN_ID, \"1.0\", variant {ICP})" --output json)
    
    if echo "$LIST_RESULT" | grep -q '"Ok"'; then
        echo -e "${GREEN}✅ NFT listed for sale at 1.0 ICP${NC}"
    else
        echo -e "${YELLOW}⚠️  NFT listing failed${NC}"
        echo "$LIST_RESULT"
    fi
fi

echo -e "${GREEN}🎉 Demo art created successfully!${NC}"
echo -e "${BLUE}Summary:${NC}"
echo -e "  - Session ID: $SESSION_ID"
echo -e "  - Art Title: $ART_TITLE"
echo -e "  - Description: $ART_DESCRIPTION"
if [ -n "$TOKEN_ID" ]; then
    echo -e "  - NFT Token ID: $TOKEN_ID"
    echo -e "  - Listed for: 1.0 ICP"
fi
echo -e "  - Creator: $USERNAME"
