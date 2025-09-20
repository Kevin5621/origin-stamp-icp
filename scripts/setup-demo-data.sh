#!/bin/bash

# Setup Demo Data Script
# Creates complete demo environment with real users and art

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Setting Up Demo Data ===${NC}"

# Check if DFX is running
if ! dfx ping 2>/dev/null; then
    echo -e "${RED}❌ DFX is not running. Please start DFX first with 'dfx start'${NC}"
    exit 1
fi

# Demo users data
declare -A USERS=(
    ["alice"]="Alice Johnson|alice@example.com|k7dkk-yqqef-devfi-ytwff-4s5c2-msb7s-dwqos-3eyor-4i27h-af4bb-rqe"
    ["bob"]="Bob Smith|bob@example.com|test-principal-bob-123"
    ["charlie"]="Charlie Brown|charlie@example.com|test-principal-charlie-456"
)

# Demo art data
declare -A ARTWORKS=(
    ["alice"]="Digital Dreams|A surreal digital painting exploring the intersection of technology and nature|https://picsum.photos/800/600?random=1"
    ["bob"]="Abstract Flow|Fluid abstract composition with vibrant colors|https://picsum.photos/800/600?random=2"
    ["charlie"]="Geometric Harmony|Mathematical precision meets artistic expression|https://picsum.photos/800/600?random=3"
)

echo -e "${YELLOW}Creating demo users and artworks...${NC}"

# Create users
for username in "${!USERS[@]}"; do
    IFS='|' read -r display_name email principal <<< "${USERS[$username]}"
    
    echo -e "${BLUE}Creating user: $username${NC}"
    
    # Register user
    REGISTER_RESULT=$(dfx canister call backend register_user "(\"$username\", \"password123\")" --output json)
    
    if echo "$REGISTER_RESULT" | grep -q '"success":true'; then
        echo -e "${GREEN}✅ User $username registered${NC}"
        
        # Update profile
        dfx canister call backend update_user_profile "(\"$username\", \"$display_name\", \"$email\", \"Demo artist from $display_name\", \"Demo City\")" > /dev/null
        
        # Link principal
        dfx canister call backend link_principal_to_user "(\"$username\", \"password123\", \"$principal\")" > /dev/null
        
        # Set subscription
        dfx canister call backend set_user_subscription "(\"$username\", variant {Premium})" > /dev/null
        
        echo -e "${GREEN}✅ User $username profile updated and principal linked${NC}"
    else
        echo -e "${YELLOW}⚠️  User $username might already exist${NC}"
    fi
done

echo -e "\n${YELLOW}Creating demo artworks...${NC}"

# Create artworks
for username in "${!ARTWORKS[@]}"; do
    IFS='|' read -r title description photo_url <<< "${ARTWORKS[$username]}"
    
    echo -e "${BLUE}Creating artwork for $username: $title${NC}"
    
    # Create art session
    SESSION_RESULT=$(dfx canister call backend create_physical_art_session "(\"$username\", \"$title\", \"$description\")" --output json)
    
    if echo "$SESSION_RESULT" | grep -q '"Ok"'; then
        SESSION_ID=$(echo "$SESSION_RESULT" | grep -o '"Ok":"[^"]*"' | cut -d'"' -f4)
        
        # Add photo
        dfx canister call backend upload_photo_to_session "(\"$SESSION_ID\", \"$photo_url\")" > /dev/null
        
        # Update status
        dfx canister call backend update_session_status "(\"$SESSION_ID\", \"completed\")" > /dev/null
        
        # Mint NFT
        ACCOUNT_PRINCIPAL="2vxsx-fae"
        
        MINT_RESULT=$(dfx canister call backend mint_nft_from_session "(\"$SESSION_ID\", record { owner = principal \"$ACCOUNT_PRINCIPAL\"; subaccount = null; }, vec { record { \"title\"; \"$title\" }; record { \"description\"; \"$description\" }; record { \"creator\"; \"$username\" } })" --output json)
        
        if echo "$MINT_RESULT" | grep -q '"Ok"'; then
            TOKEN_ID=$(echo "$MINT_RESULT" | grep -o '"Ok":[0-9]*' | cut -d':' -f2)
            
            # List for sale
            dfx canister call backend list_nft "($TOKEN_ID, \"1.0\", variant {ICP})" > /dev/null
            
            echo -e "${GREEN}✅ Artwork '$title' created and listed for sale${NC}"
        else
            echo -e "${YELLOW}⚠️  NFT minting failed for $title${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  Session creation failed for $title${NC}"
    fi
done

echo -e "\n${GREEN}🎉 Demo data setup complete!${NC}"
echo -e "${BLUE}Created:${NC}"
echo -e "  - 3 demo users: alice, bob, charlie"
echo -e "  - 3 demo artworks with NFTs"
echo -e "  - All NFTs listed for sale at 1.0 ICP"
echo -e "\n${BLUE}You can now:${NC}"
echo -e "  - Login with any username (password: password123)"
echo -e "  - View artworks in marketplace"
echo -e "  - Test the buy functionality"
echo -e "  - See trending creators"
