#!/bin/bash

# Enhanced Demo Art Creation Script
# Creates artificial art sessions, user accounts, and marketplace listings

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Artificial art data
ART_TITLES=(
    "Digital Dreams"
    "Abstract Harmony"
    "Neon Genesis"
    "Cosmic Canvas"
    "Pixel Paradise"
    "Virtual Visions"
    "Cyber Symphony"
    "Quantum Colors"
    "Matrix Memories"
    "Ethereal Essence"
)

ART_DESCRIPTIONS=(
    "A mesmerizing digital artwork exploring the intersection of technology and creativity"
    "An abstract composition that challenges traditional artistic boundaries"
    "A vibrant neon-inspired piece that captures the energy of modern life"
    "A cosmic journey through colors and shapes that transcend reality"
    "A pixel-perfect creation celebrating the beauty of digital art"
    "Virtual reality meets artistic expression in this stunning piece"
    "A cyberpunk symphony of colors, lights, and digital elements"
    "Quantum mechanics visualized through an explosion of colors"
    "Memories of the digital age captured in artistic form"
    "An ethereal piece that exists between the real and virtual worlds"
)

PHOTO_URLS=(
    "https://picsum.photos/800/600?random=1"
    "https://picsum.photos/800/600?random=2"
    "https://picsum.photos/800/600?random=3"
    "https://picsum.photos/800/600?random=4"
    "https://picsum.photos/800/600?random=5"
    "https://picsum.photos/800/600?random=6"
    "https://picsum.photos/800/600?random=7"
    "https://picsum.photos/800/600?random=8"
    "https://picsum.photos/800/600?random=9"
    "https://picsum.photos/800/600?random=10"
)

USERNAMES=(
    "digital_artist_1"
    "abstract_creator"
    "neon_master"
    "cosmic_painter"
    "pixel_wizard"
    "virtual_visionary"
    "cyber_artist"
    "quantum_creator"
    "matrix_artist"
    "ethereal_designer"
)

echo -e "${BLUE}=== Enhanced Demo Art Creation ===${NC}"

# Check if DFX is running
if ! dfx ping 2>/dev/null; then
    echo -e "${RED}❌ DFX is not running. Please start DFX first with 'dfx start'${NC}"
    exit 1
fi

# Function to get random element from array
get_random_element() {
    local arr=("$@")
    local index=$((RANDOM % ${#arr[@]}))
    echo "${arr[$index]}"
}

# Function to check if backend is ready
check_backend_ready() {
    echo -e "${BLUE}🔍 Checking backend status...${NC}"
    
    # Try to get user count as a health check
    USER_COUNT=$(dfx canister call backend get_user_count --output json 2>/dev/null || echo "null")
    
    if [ "$USER_COUNT" != "null" ]; then
        echo -e "${GREEN}✅ Backend is ready${NC}"
        return 0
    else
        echo -e "${RED}❌ Backend is not responding${NC}"
        return 1
    fi
}

# Function to create user account
create_user_account() {
    local username=$1
    local password="demo123"
    
    echo -e "${BLUE}👤 Creating user account: $username${NC}"
    
    # Check if user already exists
    USER_EXISTS=$(dfx canister call backend get_user_info "(\"$username\")" --output json 2>/dev/null | grep -q "null" && echo "false" || echo "true")
    
    if [ "$USER_EXISTS" = "true" ]; then
        echo -e "${YELLOW}⚠️  User $username already exists, skipping account creation${NC}"
        return 0
    fi
    
    # Create user account
    REGISTER_RESULT=$(dfx canister call backend register_user "(\"$username\", \"$password\")" --output json)
    
    if echo "$REGISTER_RESULT" | grep -q '"success": true'; then
        echo -e "${GREEN}✅ User account created successfully${NC}"
        
        # Initialize user subscription
        dfx canister call backend initialize_user_subscription "(\"$username\")" --output json > /dev/null
        echo -e "${GREEN}✅ User subscription initialized${NC}"
        
        return 0
    else
        echo -e "${RED}❌ Failed to create user account${NC}"
        echo "$REGISTER_RESULT"
        return 1
    fi
}

# Function to create artificial art session
create_art_session() {
    local username=$1
    local art_title=$2
    local art_description=$3
    local photo_url=$4
    
    echo -e "${BLUE}🎨 Creating art session for: $username${NC}" >&2
    echo -e "${CYAN}   Title: $art_title${NC}" >&2
    echo -e "${CYAN}   Description: $art_description${NC}" >&2
    
    # Create physical art session
    SESSION_RESULT=$(dfx canister call backend create_physical_art_session "(\"$username\", \"$art_title\", \"$art_description\")" --output json)
    
    if echo "$SESSION_RESULT" | grep -q '"Ok"'; then
        SESSION_ID=$(echo "$SESSION_RESULT" | grep -o '"Ok": "[^"]*"' | cut -d'"' -f4)
        echo -e "${GREEN}✅ Art session created with ID: $SESSION_ID${NC}" >&2
        
        # Add photo to session
        if [ -n "$photo_url" ]; then
            echo -e "${BLUE}📸 Adding photo to session...${NC}" >&2
            PHOTO_RESULT=$(dfx canister call backend upload_photo_to_session "(\"$SESSION_ID\", \"$photo_url\")" --output json)
            
            if echo "$PHOTO_RESULT" | grep -q '"Ok"'; then
                echo -e "${GREEN}✅ Photo added to session${NC}" >&2
            else
                echo -e "${YELLOW}⚠️  Photo upload failed${NC}" >&2
            fi
        fi
        
        # Update session status to completed
        echo -e "${BLUE}🔄 Updating session status to completed...${NC}" >&2
        STATUS_RESULT=$(dfx canister call backend update_session_status "(\"$SESSION_ID\", \"completed\")" --output json)
        
        if echo "$STATUS_RESULT" | grep -q '"Ok"'; then
            echo -e "${GREEN}✅ Session status updated to completed${NC}" >&2
        else
            echo -e "${YELLOW}⚠️  Status update failed${NC}" >&2
        fi
        
        echo "$SESSION_ID"
        return 0
    else
        echo -e "${RED}❌ Failed to create art session${NC}" >&2
        echo "$SESSION_RESULT" >&2
        return 1
    fi
}

# Function to mint NFT from session
mint_nft_from_session() {
    local session_id=$1
    local username=$2
    local art_title=$3
    local art_description=$4
    
    echo -e "${BLUE}🪙 Minting NFT from session...${NC}" >&2
    
    # Create a demo account for the user (using anonymous principal)
    ACCOUNT_PRINCIPAL="2vxsx-fae"
    
    MINT_RESULT=$(dfx canister call backend mint_nft_from_session "(\"$session_id\", record { owner = principal \"$ACCOUNT_PRINCIPAL\"; subaccount = null; }, vec { record { \"title\"; \"$art_title\" }; record { \"description\"; \"$art_description\" }; record { \"creator\"; \"$username\" } })" --output json)
    
    if echo "$MINT_RESULT" | grep -q '"Ok"'; then
        TOKEN_ID=$(echo "$MINT_RESULT" | grep -o '"Ok": "[^"]*"' | cut -d'"' -f4)
        echo -e "${GREEN}✅ NFT minted with Token ID: $TOKEN_ID${NC}" >&2
        echo "$TOKEN_ID"
        return 0
    else
        echo -e "${YELLOW}⚠️  NFT minting failed${NC}" >&2
        echo "$MINT_RESULT" >&2
        return 1
    fi
}

# Function to list NFT for sale
list_nft_for_sale() {
    local token_id=$1
    local price=$2
    
    echo -e "${BLUE}🏪 Listing NFT for sale...${NC}" >&2
    
    LIST_RESULT=$(dfx canister call backend list_nft "($token_id, \"$price\", variant {ICP})" --output json)
    
    if echo "$LIST_RESULT" | grep -q '"success": true'; then
        echo -e "${GREEN}✅ NFT listed for sale at $price ICP${NC}" >&2
        return 0
    else
        echo -e "${YELLOW}⚠️  NFT listing failed${NC}" >&2
        echo "$LIST_RESULT" >&2
        return 1
    fi
}

# Main execution
echo -e "${PURPLE}🎯 Starting artificial art creation process...${NC}"

# Check backend readiness
if ! check_backend_ready; then
    echo -e "${RED}❌ Backend is not ready. Please ensure DFX is running and canisters are deployed.${NC}"
    exit 1
fi

# Get number of artworks to create
read -p "How many artificial artworks to create? (default: 5): " NUM_ARTWORKS
NUM_ARTWORKS=${NUM_ARTWORKS:-5}

if ! [[ "$NUM_ARTWORKS" =~ ^[0-9]+$ ]] || [ "$NUM_ARTWORKS" -lt 1 ]; then
    echo -e "${RED}❌ Please enter a valid positive number${NC}"
    exit 1
fi

echo -e "${BLUE}Creating $NUM_ARTWORKS artificial artworks...${NC}"

# Arrays to store created data
CREATED_SESSIONS=()
CREATED_TOKENS=()
CREATED_USERS=()

# Create artificial artworks
SUCCESS_COUNT=0
ERROR_COUNT=0

for i in $(seq 1 $NUM_ARTWORKS); do
    echo -e "\n${PURPLE}=== Creating Artwork $i of $NUM_ARTWORKS ===${NC}"
    
    # Get random data
    USERNAME=$(get_random_element "${USERNAMES[@]}")
    ART_TITLE=$(get_random_element "${ART_TITLES[@]}")
    ART_DESCRIPTION=$(get_random_element "${ART_DESCRIPTIONS[@]}")
    PHOTO_URL=$(get_random_element "${PHOTO_URLS[@]}")
    
    # Generate random price between 0.5 and 5.0 ICP
    PRICE=$(echo "scale=1; $((RANDOM % 46 + 5)) / 10" | bc 2>/dev/null || echo "1.0")
    
    echo -e "${CYAN}Selected: $USERNAME - $ART_TITLE${NC}"
    
    ARTWORK_SUCCESS=false
    
    # Step 1: Create user account
    if create_user_account "$USERNAME"; then
        CREATED_USERS+=("$USERNAME")
    else
        echo -e "${YELLOW}⚠️  Continuing with existing user account${NC}"
    fi
    
    # Step 2: Create art session
    if SESSION_ID=$(create_art_session "$USERNAME" "$ART_TITLE" "$ART_DESCRIPTION" "$PHOTO_URL"); then
        CREATED_SESSIONS+=("$SESSION_ID")
        
        # Step 3: Mint NFT
        if TOKEN_ID=$(mint_nft_from_session "$SESSION_ID" "$USERNAME" "$ART_TITLE" "$ART_DESCRIPTION"); then
            CREATED_TOKENS+=("$TOKEN_ID")
            
            # Step 4: List NFT for sale
            if list_nft_for_sale "$TOKEN_ID" "$PRICE"; then
                ARTWORK_SUCCESS=true
                SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
                echo -e "${GREEN}✅ Artwork $i completed successfully!${NC}"
            fi
        fi
    fi
    
    if [ "$ARTWORK_SUCCESS" = false ]; then
        ERROR_COUNT=$((ERROR_COUNT + 1))
        echo -e "${RED}❌ Artwork $i failed to complete${NC}"
    fi
    
    # Small delay between creations
    sleep 1
done

# Summary
echo -e "\n${GREEN}🎉 Artificial Art Creation Complete!${NC}"
echo -e "${BLUE}=== Summary ===${NC}"

echo -e "${GREEN}✅ Successfully Created: $SUCCESS_COUNT artworks${NC}"
echo -e "${RED}❌ Failed: $ERROR_COUNT artworks${NC}"
echo -e "${YELLOW}📊 Total Attempted: $NUM_ARTWORKS artworks${NC}"

echo -e "\n${BLUE}=== Details ===${NC}"
echo -e "${GREEN}👥 Created Users: ${#CREATED_USERS[@]}${NC}"
for user in "${CREATED_USERS[@]}"; do
    echo -e "   - $user"
done

echo -e "${GREEN}🎨 Created Sessions: ${#CREATED_SESSIONS[@]}${NC}"
for session in "${CREATED_SESSIONS[@]}"; do
    echo -e "   - $session"
done

echo -e "${GREEN}🪙 Created NFTs: ${#CREATED_TOKENS[@]}${NC}"
for token in "${CREATED_TOKENS[@]}"; do
    echo -e "   - Token ID: $token"
done

echo -e "\n${PURPLE}🌐 View your creations at: http://127.0.0.1:8080${NC}"
echo -e "${CYAN}💡 All NFTs are listed for sale in the marketplace${NC}"

if [ $SUCCESS_COUNT -gt 0 ]; then
    echo -e "${GREEN}🎯 Success rate: $(( SUCCESS_COUNT * 100 / NUM_ARTWORKS ))%${NC}"
fi

if [ $ERROR_COUNT -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Some artworks failed to create. Check the logs above for details.${NC}"
fi
