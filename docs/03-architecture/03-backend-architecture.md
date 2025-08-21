# 🔧 Backend Architecture

## Overview

The OriginStamp ICP backend is built on the Internet Computer Protocol using Rust and IC-CDK. This architecture provides a secure, scalable, and efficient foundation for the Proof of Human Process protocol.

## 🏗️ Architecture Principles

### 1. **Decentralization First**

- Built on Internet Computer Protocol
- No single point of failure
- User-owned data and applications
- Transparent and verifiable operations

### 2. **Type Safety & Memory Safety**

- Rust's ownership and borrowing system
- Compile-time error detection
- Memory safety without garbage collection
- Zero-cost abstractions

### 3. **Security by Design**

- Input validation at all layers
- Secure authentication flows
- Proper error handling and logging
- Access control and permissions

### 4. **Performance Optimization**

- Efficient canister memory usage
- Optimized data structures
- Minimal cycle consumption
- Fast response times

## 📁 Project Structure

```
src/backend/
├── src/
│   ├── lib.rs              # Main canister implementation
│   ├── user_management.rs  # User authentication and management
│   ├── session_management.rs # Physical art session handling
│   ├── s3_integration.rs   # S3 storage integration
│   ├── nft_implementation.rs # ICRC-7 NFT functionality
│   ├── types.rs            # Type definitions
│   ├── utils.rs            # Utility functions
│   └── error.rs            # Error handling
├── Cargo.toml              # Rust dependencies
├── backend.did             # Candid interface definition
└── tests/                  # Integration tests
    └── integration_tests.rs
```

## 🧩 Module Architecture

### 1. **Core Modules**

#### User Management Module

```rust
// user_management.rs
pub mod user_management {
    use crate::types::{User, LoginResult, LoginCredentials};
    use crate::error::AppError;

    pub struct UserService;

    impl UserService {
        pub fn register_user(username: String, password: String) -> Result<LoginResult, AppError> {
            // Implementation
        }

        pub fn login_user(username: String, password: String) -> Result<LoginResult, AppError> {
            // Implementation
        }

        pub fn get_user_info(username: String) -> Option<User> {
            // Implementation
        }
    }
}
```

#### Session Management Module

```rust
// session_management.rs
pub mod session_management {
    use crate::types::{PhysicalArtSession, SessionStatus};
    use crate::error::AppError;

    pub struct SessionService;

    impl SessionService {
        pub fn create_session(
            username: String,
            art_title: String,
            description: String,
        ) -> Result<String, AppError> {
            // Implementation
        }

        pub fn update_session_status(
            session_id: String,
            status: SessionStatus,
        ) -> Result<bool, AppError> {
            // Implementation
        }

        pub fn get_user_sessions(username: String) -> Vec<PhysicalArtSession> {
            // Implementation
        }
    }
}
```

#### S3 Integration Module

```rust
// s3_integration.rs
pub mod s3_integration {
    use crate::types::{S3Config, UploadFileData};
    use crate::error::AppError;

    pub struct S3Service;

    impl S3Service {
        pub fn configure_s3(config: S3Config) -> Result<bool, AppError> {
            // Implementation
        }

        pub fn generate_upload_url(
            session_id: String,
            file_data: UploadFileData,
        ) -> Result<String, AppError> {
            // Implementation
        }

        pub fn confirm_upload(
            session_id: String,
            photo_url: String,
        ) -> Result<bool, AppError> {
            // Implementation
        }
    }
}
```

#### NFT Implementation Module

```rust
// nft_implementation.rs
pub mod nft_implementation {
    use crate::types::{Token, TokenMetadata, Account};
    use crate::error::AppError;

    pub struct NFTService;

    impl NFTService {
        pub fn mint_nft_from_session(
            session_id: String,
            recipient: Account,
            additional_attributes: Vec<(String, String)>,
        ) -> Result<u64, AppError> {
            // Implementation
        }

        pub fn get_user_nfts(owner: Principal) -> Vec<Token> {
            // Implementation
        }

        pub fn transfer_nft(
            from: Account,
            to: Account,
            token_id: u64,
        ) -> Result<bool, AppError> {
            // Implementation
        }
    }
}
```

### 2. **Type Definitions**

```rust
// types.rs
use candid::{CandidType, Deserialize, Principal};
use std::collections::HashMap;

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct User {
    pub username: String,
    pub password_hash: String,
    pub created_at: u64,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct PhysicalArtSession {
    pub session_id: String,
    pub username: String,
    pub art_title: String,
    pub description: String,
    pub uploaded_photos: Vec<String>,
    pub status: String,
    pub created_at: u64,
    pub updated_at: u64,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct Token {
    pub id: u64,
    pub owner: Account,
    pub metadata: TokenMetadata,
    pub created_at: u64,
    pub session_id: Option<String>,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct Account {
    pub owner: Principal,
    pub subaccount: Option<Vec<u8>>,
}
```

### 3. **Error Handling**

```rust
// error.rs
use std::fmt;

#[derive(Debug)]
pub enum AppError {
    ValidationError(String),
    AuthenticationError(String),
    NotFoundError(String),
    StorageError(String),
    NetworkError(String),
    InternalError(String),
}

impl fmt::Display for AppError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            AppError::ValidationError(msg) => write!(f, "Validation error: {}", msg),
            AppError::AuthenticationError(msg) => write!(f, "Authentication error: {}", msg),
            AppError::NotFoundError(msg) => write!(f, "Not found: {}", msg),
            AppError::StorageError(msg) => write!(f, "Storage error: {}", msg),
            AppError::NetworkError(msg) => write!(f, "Network error: {}", msg),
            AppError::InternalError(msg) => write!(f, "Internal error: {}", msg),
        }
    }
}
```

## 💾 Data Storage Architecture

### 1. **Canister Storage**

```rust
// lib.rs
use std::cell::RefCell;
use std::collections::HashMap;

thread_local! {
    static USERS: RefCell<HashMap<String, User>> = RefCell::new(HashMap::new());
    static SESSIONS: RefCell<HashMap<String, PhysicalArtSession>> = RefCell::new(HashMap::new());
    static S3_CONFIG: RefCell<Option<S3Config>> = RefCell::new(None);
    static TOKENS: RefCell<HashMap<u64, Token>> = RefCell::new(HashMap::new());
    static TOKEN_COUNTER: RefCell<u64> = RefCell::new(0);
}
```

### 2. **Data Access Patterns**

```rust
// Data access with error handling
pub fn get_user(username: &str) -> Option<User> {
    USERS.with(|users| {
        users.borrow().get(username).cloned()
    })
}

pub fn create_user(user: User) -> Result<(), AppError> {
    USERS.with(|users| {
        let mut users_map = users.borrow_mut();
        if users_map.contains_key(&user.username) {
            return Err(AppError::ValidationError("User already exists".to_string()));
        }
        users_map.insert(user.username.clone(), user);
        Ok(())
    })
}
```

### 3. **Data Relationships**

```rust
// Relationship management
pub fn get_user_sessions(username: &str) -> Vec<PhysicalArtSession> {
    SESSIONS.with(|sessions| {
        sessions.borrow()
            .values()
            .filter(|session| session.username == username)
            .cloned()
            .collect()
    })
}

pub fn get_session_nfts(session_id: &str) -> Vec<Token> {
    TOKENS.with(|tokens| {
        tokens.borrow()
            .values()
            .filter(|token| token.session_id.as_ref() == Some(&session_id.to_string()))
            .cloned()
            .collect()
    })
}
```

## 🔐 Security Architecture

### 1. **Input Validation**

```rust
// validation.rs
pub mod validation {
    use crate::error::AppError;

    pub fn validate_username(username: &str) -> Result<(), AppError> {
        if username.is_empty() {
            return Err(AppError::ValidationError("Username cannot be empty".to_string()));
        }

        if username.len() > 50 {
            return Err(AppError::ValidationError("Username too long".to_string()));
        }

        if !username.chars().all(|c| c.is_alphanumeric() || c == '_') {
            return Err(AppError::ValidationError("Username contains invalid characters".to_string()));
        }

        Ok(())
    }

    pub fn validate_password(password: &str) -> Result<(), AppError> {
        if password.len() < 8 {
            return Err(AppError::ValidationError("Password too short".to_string()));
        }

        if password.len() > 128 {
            return Err(AppError::ValidationError("Password too long".to_string()));
        }

        Ok(())
    }
}
```

### 2. **Authentication & Authorization**

```rust
// auth.rs
pub mod auth {
    use crate::error::AppError;
    use crate::types::User;

    pub fn hash_password(password: &str) -> String {
        // Simple hash implementation (use bcrypt in production)
        let char_sum: u32 = password.chars().map(|c| c as u32).sum::<u32>();
        format!("{:x}", (password.len() as u32) * 42 + char_sum)
    }

    pub fn verify_password(password: &str, hash: &str) -> bool {
        hash_password(password) == hash
    }

    pub fn authenticate_user(username: &str, password: &str) -> Result<User, AppError> {
        // Implementation
    }
}
```

### 3. **Access Control**

```rust
// access_control.rs
pub mod access_control {
    use ic_cdk::caller;
    use candid::Principal;
    use crate::error::AppError;

    pub fn require_authenticated() -> Result<Principal, AppError> {
        let caller = caller();
        if caller == Principal::anonymous() {
            return Err(AppError::AuthenticationError("Authentication required".to_string()));
        }
        Ok(caller)
    }

    pub fn require_session_owner(session_id: &str, username: &str) -> Result<(), AppError> {
        // Check if user owns the session
        // Implementation
        Ok(())
    }
}
```

## 🔄 API Design Patterns

### 1. **Update Functions**

```rust
#[ic_cdk::update]
pub fn create_physical_art_session(
    username: String,
    art_title: String,
    description: String,
) -> Result<String, String> {
    // Validate inputs
    validation::validate_username(&username)?;
    if art_title.is_empty() {
        return Err("Art title cannot be empty".to_string());
    }

    // Create session
    let session_id = utils::generate_session_id();
    let session = PhysicalArtSession {
        session_id: session_id.clone(),
        username,
        art_title,
        description,
        uploaded_photos: Vec::new(),
        status: "draft".to_string(),
        created_at: ic_cdk::api::time(),
        updated_at: ic_cdk::api::time(),
    };

    // Store session
    SESSIONS.with(|sessions| {
        sessions.borrow_mut().insert(session_id.clone(), session);
    });

    Ok(session_id)
}
```

### 2. **Query Functions**

```rust
#[ic_cdk::query]
pub fn get_session_details(session_id: String) -> Option<PhysicalArtSession> {
    SESSIONS.with(|sessions| {
        sessions.borrow().get(&session_id).cloned()
    })
}

#[ic_cdk::query]
pub fn get_user_sessions(username: String) -> Vec<PhysicalArtSession> {
    SESSIONS.with(|sessions| {
        sessions.borrow()
            .values()
            .filter(|session| session.username == username)
            .cloned()
            .collect()
    })
}
```

### 3. **Error Handling**

```rust
// Convert AppError to String for Candid
impl From<AppError> for String {
    fn from(error: AppError) -> String {
        error.to_string()
    }
}

// Result type for API functions
type ApiResult<T> = Result<T, String>;
```

## 🚀 Performance Optimization

### 1. **Memory Management**

```rust
// Efficient data structures
use std::collections::HashMap;

// Use references where possible
pub fn get_session_ref(session_id: &str) -> Option<&PhysicalArtSession> {
    SESSIONS.with(|sessions| {
        sessions.borrow().get(session_id)
    })
}

// Batch operations
pub fn batch_update_sessions(updates: Vec<(String, String)>) -> Vec<Result<bool, AppError>> {
    updates.into_iter().map(|(id, status)| {
        update_session_status(id, status)
    }).collect()
}
```

### 2. **Cycle Optimization**

```rust
// Minimize canister calls
pub fn get_multiple_sessions(session_ids: Vec<String>) -> Vec<Option<PhysicalArtSession>> {
    SESSIONS.with(|sessions| {
        let sessions_map = sessions.borrow();
        session_ids.into_iter()
            .map(|id| sessions_map.get(&id).cloned())
            .collect()
    })
}

// Efficient pagination
pub fn get_sessions_paginated(
    username: &str,
    page: u32,
    limit: u32,
) -> (Vec<PhysicalArtSession>, bool) {
    let all_sessions = get_user_sessions(username.to_string());
    let start = (page * limit) as usize;
    let end = start + limit as usize;

    let sessions = all_sessions.into_iter()
        .skip(start)
        .take(limit as usize)
        .collect();

    let has_more = end < all_sessions.len();

    (sessions, has_more)
}
```

## 🔧 Development Tools

### 1. **Testing**

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_create_session() {
        let result = create_physical_art_session(
            "testuser".to_string(),
            "Test Art".to_string(),
            "Test Description".to_string(),
        );

        assert!(result.is_ok());

        let session_id = result.unwrap();
        let session = get_session_details(session_id).unwrap();

        assert_eq!(session.username, "testuser");
        assert_eq!(session.art_title, "Test Art");
    }
}
```

### 2. **Debugging**

```rust
#[ic_cdk::query]
pub fn debug_info() -> String {
    format!(
        "Users: {}, Sessions: {}, Tokens: {}, S3 Configured: {}",
        USERS.with(|u| u.borrow().len()),
        SESSIONS.with(|s| s.borrow().len()),
        TOKENS.with(|t| t.borrow().len()),
        S3_CONFIG.with(|c| c.borrow().is_some())
    )
}
```

## 📊 Monitoring & Observability

### 1. **Health Checks**

```rust
#[ic_cdk::query]
pub fn health_check() -> HealthStatus {
    HealthStatus {
        status: "healthy".to_string(),
        timestamp: ic_cdk::api::time(),
        version: env!("CARGO_PKG_VERSION").to_string(),
    }
}
```

### 2. **Metrics Collection**

```rust
#[ic_cdk::query]
pub fn get_metrics() -> Metrics {
    Metrics {
        total_users: USERS.with(|u| u.borrow().len()),
        total_sessions: SESSIONS.with(|s| s.borrow().len()),
        total_tokens: TOKENS.with(|t| t.borrow().len()),
        memory_usage: ic_cdk::api::stable::size(),
    }
}
```

## 🔗 Integration Patterns

### 1. **External Service Integration**

```rust
// S3 Integration
pub async fn generate_s3_presigned_url(
    bucket: &str,
    key: &str,
    expires: u64,
) -> Result<String, AppError> {
    // Implementation for S3 presigned URL generation
}

// Google OAuth Integration
pub fn verify_google_token(token: &str) -> Result<GoogleUserInfo, AppError> {
    // Implementation for Google token verification
}
```

### 2. **ICRC-7 NFT Integration**

```rust
// ICRC-7 standard implementation
pub fn icrc7_transfer(requests: Vec<TransferRequest>) -> Vec<TransferResponse> {
    requests.into_iter().map(|request| {
        match transfer_token(request) {
            Ok(_) => TransferResponse {
                token_id: request.token_id,
                result: Ok(()),
            },
            Err(error) => TransferResponse {
                token_id: request.token_id,
                result: Err(error.to_string()),
            },
        }
    }).collect()
}
```

## 📚 Related Documentation

- **[API Reference](../05-backend/01-api-reference.md)** - Complete API documentation
- **[User Management](../05-backend/02-user-management.md)** - Authentication system
- **[Physical Art Sessions](../05-backend/03-physical-art-sessions.md)** - Session management
- **[S3 Integration](../05-backend/04-s3-integration.md)** - File storage system
- **[ICRC-7 NFT Implementation](../05-backend/05-icrc7-nft-implementation.md)** - NFT functionality

---

_This backend architecture provides a robust, secure, and scalable foundation for the OriginStamp ICP platform._
