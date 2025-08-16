# ICRC-7 NFT Implementation

This document describes the ICRC-7 NFT functionality implemented in the Origin Stamp backend canister.

## Overview

The ICRC-7 (Internet Computer Request for Comments - 7) is the standard for Non-Fungible Tokens (NFTs) on the Internet Computer. Our implementation allows users to mint NFTs representing physical art pieces that have been authenticated through the Origin Stamp platform.

## Key Features

### ICRC-7 Standard Compliance

Our implementation follows the ICRC-7 standard and includes all required methods:

- **Collection Information**: `icrc7_name()`, `icrc7_description()`, `icrc7_collection_metadata()`
- **Supply Information**: `icrc7_total_supply()`, `icrc7_supply_cap()`
- **Token Queries**: `icrc7_tokens()`, `icrc7_owner_of()`, `icrc7_token_metadata()`
- **Balance Queries**: `icrc7_balance_of()`, `icrc7_tokens_of()`
- **Transfer Operations**: `icrc7_transfer()`

### Custom Origin Stamp Features

- **Session-Based Minting**: NFTs are minted from physical art sessions
- **Rich Metadata**: Includes artist information, photo URLs, and custom attributes
- **Session Linking**: Each NFT maintains a link to its originating art session
- **User Queries**: Custom functions to query NFTs by user or session

## Data Structures

### Account

```rust
pub struct Account {
    pub owner: candid::Principal,
    pub subaccount: Option<Vec<u8>>,
}
```

### Token

```rust
pub struct Token {
    pub id: u64,
    pub owner: Account,
    pub metadata: TokenMetadata,
    pub created_at: u64,
    pub session_id: Option<String>,
}
```

### TokenMetadata

```rust
pub struct TokenMetadata {
    pub name: String,
    pub description: Option<String>,
    pub image: Option<String>,
    pub attributes: Vec<(String, String)>,
}
```

## Core Functions

### Standard ICRC-7 Functions

#### Query Functions

- `icrc7_collection_metadata() -> CollectionMetadata`
- `icrc7_name() -> String`
- `icrc7_description() -> Option<String>`
- `icrc7_total_supply() -> u64`
- `icrc7_supply_cap() -> Option<u64>`
- `icrc7_tokens(prev: Option<u64>, take: Option<u64>) -> Vec<u64>`
- `icrc7_owner_of(token_ids: Vec<u64>) -> Vec<Option<Account>>`
- `icrc7_balance_of(accounts: Vec<Account>) -> Vec<u64>`
- `icrc7_tokens_of(account: Account, prev: Option<u64>, take: Option<u64>) -> Vec<u64>`
- `icrc7_token_metadata(token_ids: Vec<u64>) -> Vec<Option<TokenMetadata>>`

#### Update Functions

- `icrc7_transfer(requests: Vec<TransferRequest>) -> Vec<TransferResponse>`

### Custom Functions

#### Minting

- `mint_nft_from_session(session_id: String, recipient: Account, additional_attributes: Vec<(String, String)>) -> Result<u64, String>`

#### Queries

- `get_session_nfts(session_id: String) -> Vec<Token>`
- `get_user_nfts(owner: candid::Principal) -> Vec<Token>`
- `get_token_details(token_id: u64) -> Option<Token>`

#### Administration

- `update_collection_metadata(name: String, description: Option<String>, image: Option<String>, max_supply: Option<u64>) -> Result<bool, String>`

## Usage Examples

### Minting an NFT

```bash
# First create a physical art session
dfx canister call backend create_physical_art_session '("artist_name", "Art Title", "Description")'

# Add photos to the session
dfx canister call backend upload_photo_to_session '("session_id", "https://example.com/photo.jpg")'

# Mint NFT from the session
dfx canister call backend mint_nft_from_session '(
    "session_id",
    record {
        owner = principal "rdmx6-jaaaa-aaaaa-aaadq-cai";
        subaccount = null
    },
    vec {
        record { "rarity"; "rare" };
        record { "medium"; "digital" }
    }
)'
```

### Querying NFTs

```bash
# Get total supply
dfx canister call backend icrc7_total_supply

# Get collection metadata
dfx canister call backend icrc7_collection_metadata

# Get token metadata
dfx canister call backend icrc7_token_metadata '(vec { 1 })'

# Get user's NFTs
dfx canister call backend get_user_nfts '(principal "rdmx6-jaaaa-aaaaa-aaadq-cai")'
```

### Transferring NFTs

```bash
dfx canister call backend icrc7_transfer '(vec {
    record {
        from = record {
            owner = principal "sender-principal";
            subaccount = null
        };
        to = record {
            owner = principal "recipient-principal";
            subaccount = null
        };
        token_id = 1;
        memo = null;
        created_at_time = null
    }
})'
```

## NFT Metadata

When an NFT is minted from a physical art session, the following metadata is automatically included:

### Standard Attributes

- `session_id`: The originating art session ID
- `artist`: The username of the session creator
- `art_title`: The title of the artwork
- `created_at`: Timestamp of NFT creation
- `token_hash`: Unique hash for the token
- `photo_count`: Number of photos in the session

### Photo Attributes

- `photo_1`, `photo_2`, etc.: URLs of uploaded photos

### Custom Attributes

Additional attributes can be specified during minting to add extra metadata like rarity, medium, edition numbers, etc.

## Security Features

- **Ownership Verification**: Only token owners can transfer their NFTs
- **Session Validation**: NFTs can only be minted from valid art sessions
- **Immutable Metadata**: Once minted, core token metadata cannot be changed
- **Principal-Based Security**: Uses Internet Computer's built-in principal system

## Testing

Use the provided test script to test the NFT functionality:

```bash
./test-nft-functionality.sh
```

This script demonstrates:

1. Collection metadata queries
2. Session creation and photo upload
3. NFT minting with custom attributes
4. Token queries and metadata retrieval
5. Ownership and balance checks

## Integration with Frontend

The frontend can integrate with these NFT functions using the generated TypeScript declarations in `/src/declarations/backend/`. Example usage:

```typescript
import { backend } from "../../declarations/backend";

// Mint NFT
const result = await backend.mint_nft_from_session(
  sessionId,
  { owner: userPrincipal, subaccount: [] },
  [
    ["rarity", "rare"],
    ["medium", "digital"],
  ],
);

// Get user's NFTs
const userNFTs = await backend.get_user_nfts(userPrincipal);

// Get collection info
const collectionInfo = await backend.icrc7_collection_metadata();
```

## Future Enhancements

Potential improvements that could be added:

1. **Royalties**: Implement ICRC-7 royalty extensions
2. **Batch Operations**: Support for batch minting and transfers
3. **Access Control**: Role-based permissions for minting and admin functions
4. **Marketplace Integration**: Functions to support NFT trading
5. **Metadata Updates**: Allow certain metadata updates by authorized parties
6. **Burning**: Implement token burning functionality
7. **Advanced Queries**: More sophisticated filtering and search capabilities
