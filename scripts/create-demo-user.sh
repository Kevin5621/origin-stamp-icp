#!/bin/bash

# Create Demo User Script
# Creates a real user with real data for testing

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Creating Demo User ===${NC}"

# Check if DFX is running
if ! dfx ping 2>/dev/null; then
    echo -e "${RED}❌ DFX is not running. Please start DFX first with 'dfx start'${NC}"
    exit 1
fi

# Get user input
read -p "Enter username: " USERNAME
read -p "Enter password: " PASSWORD
read -p "Enter email: " EMAIL
read -p "Enter principal (optional, press Enter to skip): " PRINCIPAL

if [ -z "$USERNAME" ] || [ -z "$PASSWORD" ] || [ -z "$EMAIL" ]; then
    echo -e "${RED}❌ Username, password, and email are required${NC}"
    exit 1
fi

echo -e "${YELLOW}Creating user: $USERNAME${NC}"

# Register user
echo -e "${BLUE}1. Registering user...${NC}"
REGISTER_RESULT=$(dfx canister call backend register_user "(\"$USERNAME\", \"$PASSWORD\")" --output json)

if echo "$REGISTER_RESULT" | grep -q '"success":true'; then
    echo -e "${GREEN}✅ User registered successfully${NC}"
else
    echo -e "${RED}❌ Failed to register user${NC}"
    echo "$REGISTER_RESULT"
    exit 1
fi

# Update user profile
echo -e "${BLUE}2. Updating user profile...${NC}"
PROFILE_RESULT=$(dfx canister call backend update_user_profile "(\"$USERNAME\", \"$USERNAME\", \"$EMAIL\", \"Demo User Bio\", \"Demo Location\")" --output json)

if echo "$PROFILE_RESULT" | grep -q '"success":true'; then
    echo -e "${GREEN}✅ User profile updated${NC}"
else
    echo -e "${YELLOW}⚠️  Profile update failed, but user was created${NC}"
fi

# Link principal if provided
if [ -n "$PRINCIPAL" ]; then
    echo -e "${BLUE}3. Linking principal...${NC}"
    LINK_RESULT=$(dfx canister call backend link_principal_to_user "(\"$USERNAME\", \"$PASSWORD\", \"$PRINCIPAL\")" --output json)
    
    if echo "$LINK_RESULT" | grep -q '"success":true'; then
        echo -e "${GREEN}✅ Principal linked successfully${NC}"
    else
        echo -e "${YELLOW}⚠️  Principal linking failed${NC}"
    fi
fi

# Set subscription
echo -e "${BLUE}4. Setting subscription...${NC}"
SUBSCRIPTION_RESULT=$(dfx canister call backend set_user_subscription "(\"$USERNAME\", variant {Premium})" --output json)

if echo "$SUBSCRIPTION_RESULT" | grep -q '"success":true'; then
    echo -e "${GREEN}✅ Subscription set to Premium${NC}"
else
    echo -e "${YELLOW}⚠️  Subscription setting failed${NC}"
fi

echo -e "${GREEN}🎉 Demo user '$USERNAME' created successfully!${NC}"
echo -e "${BLUE}You can now:${NC}"
echo -e "  - Login with username: $USERNAME"
echo -e "  - Password: $PASSWORD"
if [ -n "$PRINCIPAL" ]; then
    echo -e "  - Or login with principal: $PRINCIPAL"
fi
echo -e "  - Create art sessions and mint NFTs"
echo -e "  - List NFTs for sale in marketplace"
