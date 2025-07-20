# User Management System

## Overview

Sistem manajemen pengguna di Origin Stamp ICP menyediakan fitur registrasi, autentikasi, dan manajemen user dengan penyimpanan data yang persistent di canister.

## Architecture

```
User Registration/Login
    ↓
Simple Hash Authentication
    ↓
User Storage (HashMap in Canister)
    ↓
Session Management
```

## Data Structure

### User Model

```rust
pub struct User {
    pub username: String,        // Unique username
    pub password_hash: String,   // Hashed password
    pub created_at: u64,        // Timestamp creation
}
```

### Login Result Model

```rust
pub struct LoginResult {
    pub success: bool,           // Status operasi
    pub message: String,         // Pesan hasil
    pub username: Option<String>, // Username jika berhasil
}
```

## Authentication System

### Password Hashing

Sistem menggunakan fungsi hash sederhana untuk password:

```rust
fn simple_hash(password: &str) -> String {
    let char_sum: u32 = password.chars().map(|c| c as u32).sum::<u32>();
    format!("{:x}", (password.len() as u32) * 42 + char_sum)
}
```

**⚠️ Note**: Ini adalah implementasi basic untuk development. Untuk production, gunakan library seperti `bcrypt` atau `argon2`.

## Core Functions

### User Registration

```rust
#[ic_cdk::update]
fn register_user(username: String, password: String) -> LoginResult
```

**Process Flow:**

1. Validasi input (username dan password tidak kosong)
2. Cek apakah username sudah ada
3. Hash password
4. Simpan user baru dengan timestamp
5. Return result

**Validation Rules:**

- Username dan password tidak boleh kosong
- Username harus unique
- Tidak ada batasan panjang minimum (bisa ditambahkan)

**Example Usage:**

```bash
# Successful registration
dfx canister call backend register_user '("john_doe", "mypassword123")'
# Result: {success = true; message = "User registered successfully"; username = opt "john_doe"}

# Duplicate username
dfx canister call backend register_user '("john_doe", "otherpassword")'
# Result: {success = false; message = "Username already exists"; username = null}

# Empty fields
dfx canister call backend register_user '("", "")'
# Result: {success = false; message = "Username and password cannot be empty"; username = null}
```

### User Authentication

```rust
#[ic_cdk::update]
fn login(username: String, password: String) -> LoginResult
```

**Process Flow:**

1. Validasi input
2. Cari user berdasarkan username
3. Hash password input
4. Bandingkan dengan stored hash
5. Return result dengan status

**Example Usage:**

```bash
# Successful login
dfx canister call backend login '("john_doe", "mypassword123")'
# Result: {success = true; message = "Login successful"; username = opt "john_doe"}

# Wrong password
dfx canister call backend login '("john_doe", "wrongpassword")'
# Result: {success = false; message = "Invalid password"; username = null}

# User not found
dfx canister call backend login '("nonexistent", "password")'
# Result: {success = false; message = "User not found"; username = null}
```

## Query Functions

### Get All Users

```rust
#[ic_cdk::query]
fn get_all_users() -> Vec<String>
```

Mengembalikan daftar semua username yang terdaftar.

**Example:**

```bash
dfx canister call backend get_all_users
# Result: (vec { "john_doe"; "alice_smith"; "bob_wilson" })
```

### Get User Info

```rust
#[ic_cdk::query]
fn get_user_info(username: String) -> Option<(String, u64)>
```

Mengembalikan informasi user (username dan created_at).

**Example:**

```bash
dfx canister call backend get_user_info '("john_doe")'
# Result: (opt (record { "john_doe"; 1_640_995_200_000_000_000 }))
```

### Get User Count

```rust
#[ic_cdk::query]
fn get_user_count() -> usize
```

Mengembalikan jumlah total user terdaftar.

**Example:**

```bash
dfx canister call backend get_user_count
# Result: (3 : nat64)
```

## Data Storage

### Storage Implementation

```rust
thread_local! {
    static USERS: RefCell<HashMap<String, User>> = RefCell::new(HashMap::new());
}
```

**Characteristics:**

- **Persistent**: Data tersimpan di canister stable memory
- **Thread-local**: Menggunakan `RefCell` untuk interior mutability
- **Key-Value**: HashMap dengan username sebagai key
- **Performance**: O(1) lookup berdasarkan username

## Security Considerations

### Current Implementation

- ✅ Basic password hashing
- ✅ Input validation
- ✅ Unique username enforcement
- ❌ Password strength requirements
- ❌ Rate limiting
- ❌ Session management
- ❌ Secure password hashing

### Production Recommendations

1. **Password Hashing**

   ```toml
   # Cargo.toml
   [dependencies]
   bcrypt = "0.14"
   ```

   ```rust
   use bcrypt::{hash, verify, DEFAULT_COST};

   fn hash_password(password: &str) -> Result<String, String> {
       hash(password, DEFAULT_COST).map_err(|e| e.to_string())
   }
   ```

2. **Password Validation**

   ```rust
   fn validate_password(password: &str) -> Result<(), String> {
       if password.len() < 8 {
           return Err("Password must be at least 8 characters".to_string());
       }
       // Add more validation rules
       Ok(())
   }
   ```

3. **Rate Limiting**
   ```rust
   // Track login attempts per IP/user
   thread_local! {
       static LOGIN_ATTEMPTS: RefCell<HashMap<String, (u32, u64)>> =
           RefCell::new(HashMap::new());
   }
   ```

## Integration Examples

### Frontend Integration (TypeScript)

```typescript
import { backend } from "../../declarations/backend";

// Register new user
async function registerUser(username: string, password: string) {
  try {
    const result = await backend.register_user(username, password);
    if (result.success) {
      console.log("Registration successful:", result.username);
      return result;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
}

// Login user
async function loginUser(username: string, password: string) {
  try {
    const result = await backend.login(username, password);
    if (result.success) {
      // Store user session
      localStorage.setItem("currentUser", result.username || "");
      return result;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
}
```

### Shell Script Integration

```bash
#!/bin/bash

# Register user
register_user() {
    local username=$1
    local password=$2

    result=$(dfx canister call backend register_user "(\"$username\", \"$password\")")
    echo "Registration result: $result"
}

# Login user
login_user() {
    local username=$1
    local password=$2

    result=$(dfx canister call backend login "(\"$username\", \"$password\")")
    echo "Login result: $result"
}

# Usage
register_user "testuser" "testpassword123"
login_user "testuser" "testpassword123"
```

## Error Handling

### Common Error Scenarios

1. **Empty Fields**

   - Message: "Username and password cannot be empty"
   - Action: Validate input before submission

2. **Duplicate Username**

   - Message: "Username already exists"
   - Action: Suggest alternative username

3. **User Not Found**

   - Message: "User not found"
   - Action: Redirect to registration

4. **Invalid Password**
   - Message: "Invalid password"
   - Action: Allow retry with rate limiting

## Testing

### Unit Tests

```bash
# Test successful registration
dfx canister call backend register_user '("test_user", "test_password")'

# Test duplicate registration
dfx canister call backend register_user '("test_user", "another_password")'

# Test successful login
dfx canister call backend login '("test_user", "test_password")'

# Test invalid login
dfx canister call backend login '("test_user", "wrong_password")'

# Test user queries
dfx canister call backend get_all_users
dfx canister call backend get_user_count
dfx canister call backend get_user_info '("test_user")'
```

### Load Testing

```bash
#!/bin/bash
# Create multiple users
for i in {1..10}; do
    dfx canister call backend register_user "(\"user$i\", \"password$i\")"
done

# Verify user count
dfx canister call backend get_user_count
```

## Future Enhancements

### Planned Features

- [ ] Password strength validation
- [ ] Email verification
- [ ] OAuth integration
- [ ] Two-factor authentication
- [ ] User roles and permissions
- [ ] Profile management
- [ ] Password reset functionality
- [ ] Account deactivation

### Database Migration

Untuk production scale, pertimbangkan migrasi ke:

- IC stable structures untuk persistence
- External database untuk complex queries
- Distributed storage untuk scalability
