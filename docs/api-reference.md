# API Reference - Backend Canister Functions

## Overview

Dokumentasi lengkap untuk semua fungsi yang tersedia di backend canister Origin Stamp ICP.

## Data Structures

### User

```rust
pub struct User {
    pub username: String,
    pub password_hash: String,
    pub created_at: u64,
}
```

### LoginResult

```rust
pub struct LoginResult {
    pub success: bool,
    pub message: String,
    pub username: Option<String>,
}
```

### PhysicalArtSession

```rust
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
```

### UploadFileData

```rust
pub struct UploadFileData {
    pub filename: String,
    pub content_type: String,
    pub file_size: u64,
}
```

### S3Config

```rust
pub struct S3Config {
    pub bucket_name: String,
    pub region: String,
    pub access_key_id: String,
    pub secret_access_key: String,
    pub endpoint: Option<String>,
}
```

## User Management Functions

### register_user

**Type**: Update function  
**Signature**: `register_user(username: String, password: String) -> LoginResult`

Mendaftarkan user baru ke sistem.

**Parameters:**

- `username` - Nama pengguna (tidak boleh kosong)
- `password` - Password pengguna (tidak boleh kosong)

**Returns:**

- `LoginResult` dengan status registrasi

**Example:**

```bash
dfx canister call backend register_user '("john_doe", "mypassword123")'
```

**Possible Results:**

- Success: `{success = true; message = "User registered successfully"; username = opt "john_doe"}`
- Error: `{success = false; message = "Username already exists"; username = null}`

---

### login

**Type**: Update function  
**Signature**: `login(username: String, password: String) -> LoginResult`

Melakukan autentikasi user.

**Parameters:**

- `username` - Nama pengguna
- `password` - Password pengguna

**Returns:**

- `LoginResult` dengan status login

**Example:**

```bash
dfx canister call backend login '("john_doe", "mypassword123")'
```

---

### get_all_users

**Type**: Query function  
**Signature**: `get_all_users() -> Vec<String>`

Mengambil daftar semua username yang terdaftar.

**Returns:**

- Vector berisi semua username

**Example:**

```bash
dfx canister call backend get_all_users
```

---

### get_user_info

**Type**: Query function  
**Signature**: `get_user_info(username: String) -> Option<(String, u64)>`

Mengambil informasi user berdasarkan username.

**Parameters:**

- `username` - Nama pengguna

**Returns:**

- `Some((username, created_at))` jika user ditemukan
- `None` jika user tidak ditemukan

**Example:**

```bash
dfx canister call backend get_user_info '("john_doe")'
```

---

### get_user_count

**Type**: Query function  
**Signature**: `get_user_count() -> usize`

Mengambil jumlah total user yang terdaftar.

**Returns:**

- Jumlah user sebagai integer

**Example:**

```bash
dfx canister call backend get_user_count
```

## Physical Art Session Functions

### create_physical_art_session

**Type**: Update function  
**Signature**: `create_physical_art_session(username: String, art_title: String, description: String) -> Result<String, String>`

Membuat session baru untuk physical art.

**Parameters:**

- `username` - Nama pengguna pemilik session
- `art_title` - Judul artwork
- `description` - Deskripsi artwork

**Returns:**

- `Ok(session_id)` - ID session yang baru dibuat
- `Err(message)` - Error message jika gagal

**Example:**

```bash
dfx canister call backend create_physical_art_session '("john_doe", "My Art", "Beautiful artwork")'
```

---

### generate_upload_url

**Type**: Update function  
**Signature**: `generate_upload_url(session_id: String, file_data: UploadFileData) -> Result<String, String>`

Generate presigned URL untuk upload file.

**Parameters:**

- `session_id` - ID session
- `file_data` - Data file yang akan diupload

**Returns:**

- `Ok(upload_url)` - Presigned URL untuk upload
- `Err(message)` - Error message jika gagal

**Example:**

```bash
dfx canister call backend generate_upload_url '("abc123", record { filename="photo.jpg"; content_type="image/jpeg"; file_size=1024 })'
```

---

### upload_photo_to_session

**Type**: Update function  
**Signature**: `upload_photo_to_session(session_id: String, photo_url: String) -> Result<bool, String>`

Mencatat photo yang telah diupload ke session.

**Parameters:**

- `session_id` - ID session
- `photo_url` - URL foto yang telah diupload

**Returns:**

- `Ok(true)` - Berhasil mencatat photo
- `Err(message)` - Error message jika gagal

**Example:**

```bash
dfx canister call backend upload_photo_to_session '("abc123", "https://s3.amazonaws.com/bucket/photo.jpg")'
```

---

### get_session_details

**Type**: Query function  
**Signature**: `get_session_details(session_id: String) -> Option<PhysicalArtSession>`

Mengambil detail session berdasarkan ID.

**Parameters:**

- `session_id` - ID session

**Returns:**

- `Some(session)` - Detail session jika ditemukan
- `None` - Jika session tidak ditemukan

**Example:**

```bash
dfx canister call backend get_session_details '("abc123")'
```

---

### get_user_sessions

**Type**: Query function  
**Signature**: `get_user_sessions(username: String) -> Vec<PhysicalArtSession>`

Mengambil semua session milik user tertentu.

**Parameters:**

- `username` - Nama pengguna

**Returns:**

- Vector berisi semua session user

**Example:**

```bash
dfx canister call backend get_user_sessions '("john_doe")'
```

---

### update_session_status

**Type**: Update function  
**Signature**: `update_session_status(session_id: String, status: String) -> Result<bool, String>`

Mengupdate status session.

**Parameters:**

- `session_id` - ID session
- `status` - Status baru (contoh: "draft", "in_progress", "completed")

**Returns:**

- `Ok(true)` - Berhasil update status
- `Err(message)` - Error message jika gagal

**Example:**

```bash
dfx canister call backend update_session_status '("abc123", "completed")'
```

---

### remove_photo_from_session

**Type**: Update function  
**Signature**: `remove_photo_from_session(session_id: String, photo_url: String) -> Result<bool, String>`

Menghapus photo dari session.

**Parameters:**

- `session_id` - ID session
- `photo_url` - URL photo yang akan dihapus

**Returns:**

- `Ok(true)` - Berhasil menghapus photo
- `Err(message)` - Error message jika gagal

**Example:**

```bash
dfx canister call backend remove_photo_from_session '("abc123", "https://s3.amazonaws.com/bucket/photo.jpg")'
```

## S3 Configuration Functions

### configure_s3

**Type**: Update function  
**Signature**: `configure_s3(config: S3Config) -> bool`

Mengkonfigurasi pengaturan S3.

**Parameters:**

- `config` - Konfigurasi S3

**Returns:**

- `true` - Berhasil mengkonfigurasi S3

**Example:**

```bash
dfx canister call backend configure_s3 '(record {
    bucket_name="my-bucket";
    region="us-east-1";
    access_key_id="AKIAXX";
    secret_access_key="secret";
    endpoint=opt "https://s3.amazonaws.com"
})'
```

---

### set_s3_config

**Type**: Update function  
**Signature**: `set_s3_config(config: S3Config) -> bool`

Alias untuk `configure_s3`.

---

### get_s3_config

**Type**: Query function  
**Signature**: `get_s3_config() -> Option<S3Config>`

Mengambil konfigurasi S3 saat ini.

**Returns:**

- `Some(config)` - Konfigurasi S3 jika ada
- `None` - Jika belum dikonfigurasi

**Example:**

```bash
dfx canister call backend get_s3_config
```

---

### get_s3_config_status

**Type**: Query function  
**Signature**: `get_s3_config_status() -> bool`

Mengecek apakah S3 sudah dikonfigurasi.

**Returns:**

- `true` - S3 sudah dikonfigurasi
- `false` - S3 belum dikonfigurasi

**Example:**

```bash
dfx canister call backend get_s3_config_status
```

## ICRC-7 NFT Functions

### Data Structures for NFT

#### Account

```rust
pub struct Account {
    pub owner: candid::Principal,
    pub subaccount: Option<Vec<u8>>,
}
```

#### TokenMetadata

```rust
pub struct TokenMetadata {
    pub name: String,
    pub description: Option<String>,
    pub image: Option<String>,
    pub attributes: Vec<(String, String)>,
}
```

#### Token

```rust
pub struct Token {
    pub id: u64,
    pub owner: Account,
    pub metadata: TokenMetadata,
    pub created_at: u64,
    pub session_id: Option<String>,
}
```

#### TransferRequest

```rust
pub struct TransferRequest {
    pub from: Account,
    pub to: Account,
    pub token_id: u64,
    pub memo: Option<Vec<u8>>,
    pub created_at_time: Option<u64>,
}
```

#### TransferResponse

```rust
pub struct TransferResponse {
    pub token_id: u64,
    pub result: Result<(), String>,
}
```

#### CollectionMetadata

```rust
pub struct CollectionMetadata {
    pub name: String,
    pub description: Option<String>,
    pub image: Option<String>,
    pub total_supply: u64,
    pub max_supply: Option<u64>,
}
```

### icrc7_collection_metadata

**Type**: Query function  
**Signature**: `icrc7_collection_metadata() -> CollectionMetadata`

Mengambil metadata collection NFT.

**Returns:**

- `CollectionMetadata` - Metadata lengkap collection

**Example:**

```bash
dfx canister call backend icrc7_collection_metadata
```

---

### icrc7_name

**Type**: Query function  
**Signature**: `icrc7_name() -> String`

Mengambil nama collection NFT.

**Returns:**

- `String` - Nama collection

**Example:**

```bash
dfx canister call backend icrc7_name
```

---

### icrc7_description

**Type**: Query function  
**Signature**: `icrc7_description() -> Option<String>`

Mengambil deskripsi collection NFT.

**Returns:**

- `Some(description)` - Deskripsi collection jika ada
- `None` - Jika tidak ada deskripsi

**Example:**

```bash
dfx canister call backend icrc7_description
```

---

### icrc7_total_supply

**Type**: Query function  
**Signature**: `icrc7_total_supply() -> u64`

Mengambil total supply NFT yang sudah di-mint.

**Returns:**

- `u64` - Jumlah total NFT

**Example:**

```bash
dfx canister call backend icrc7_total_supply
```

---

### icrc7_supply_cap

**Type**: Query function  
**Signature**: `icrc7_supply_cap() -> Option<u64>`

Mengambil batas maksimum supply NFT.

**Returns:**

- `Some(cap)` - Batas maksimum jika ada
- `None` - Jika tidak ada batas

**Example:**

```bash
dfx canister call backend icrc7_supply_cap
```

---

### icrc7_tokens

**Type**: Query function  
**Signature**: `icrc7_tokens(prev: Option<u64>, take: Option<u64>) -> Vec<u64>`

Mengambil daftar token ID dengan pagination.

**Parameters:**

- `prev` - Token ID sebelumnya untuk pagination (optional)
- `take` - Jumlah token yang diambil (optional, max 1000)

**Returns:**

- `Vec<u64>` - Daftar token ID

**Example:**

```bash
dfx canister call backend icrc7_tokens '(null, opt 10)'
```

---

### icrc7_owner_of

**Type**: Query function  
**Signature**: `icrc7_owner_of(token_ids: Vec<u64>) -> Vec<Option<Account>>`

Mengambil pemilik dari token-token tertentu.

**Parameters:**

- `token_ids` - Daftar token ID

**Returns:**

- `Vec<Option<Account>>` - Daftar pemilik untuk setiap token

**Example:**

```bash
dfx canister call backend icrc7_owner_of '(vec { 1; 2; 3 })'
```

---

### icrc7_balance_of

**Type**: Query function  
**Signature**: `icrc7_balance_of(accounts: Vec<Account>) -> Vec<u64>`

Mengambil jumlah NFT yang dimiliki oleh akun-akun tertentu.

**Parameters:**

- `accounts` - Daftar akun

**Returns:**

- `Vec<u64>` - Jumlah NFT untuk setiap akun

**Example:**

```bash
dfx canister call backend icrc7_balance_of '(vec { record { owner=principal "rrkah-fqaaa-aaaaa-aaaaq-cai"; subaccount=null } })'
```

---

### icrc7_tokens_of

**Type**: Query function  
**Signature**: `icrc7_tokens_of(account: Account, prev: Option<u64>, take: Option<u64>) -> Vec<u64>`

Mengambil daftar token ID yang dimiliki oleh akun tertentu dengan pagination.

**Parameters:**

- `account` - Akun pemilik
- `prev` - Token ID sebelumnya untuk pagination (optional)
- `take` - Jumlah token yang diambil (optional, max 1000)

**Returns:**

- `Vec<u64>` - Daftar token ID milik akun

**Example:**

```bash
dfx canister call backend icrc7_tokens_of '(record { owner=principal "rrkah-fqaaa-aaaaa-aaaaq-cai"; subaccount=null }, null, opt 10)'
```

---

### icrc7_token_metadata

**Type**: Query function  
**Signature**: `icrc7_token_metadata(token_ids: Vec<u64>) -> Vec<Option<TokenMetadata>>`

Mengambil metadata dari token-token tertentu.

**Parameters:**

- `token_ids` - Daftar token ID

**Returns:**

- `Vec<Option<TokenMetadata>>` - Metadata untuk setiap token

**Example:**

```bash
dfx canister call backend icrc7_token_metadata '(vec { 1; 2 })'
```

---

### icrc7_transfer

**Type**: Update function  
**Signature**: `icrc7_transfer(requests: Vec<TransferRequest>) -> Vec<TransferResponse>`

Transfer NFT antar akun.

**Parameters:**

- `requests` - Daftar request transfer

**Returns:**

- `Vec<TransferResponse>` - Hasil transfer untuk setiap request

**Example:**

```bash
dfx canister call backend icrc7_transfer '(vec {
    record {
        from=record { owner=principal "rrkah-fqaaa-aaaaa-aaaaq-cai"; subaccount=null };
        to=record { owner=principal "rdmx6-jaaaa-aaaah-qcaiq-cai"; subaccount=null };
        token_id=1;
        memo=null;
        created_at_time=null
    }
})'
```

---

### mint_nft_from_session

**Type**: Update function  
**Signature**: `mint_nft_from_session(session_id: String, recipient: Account, additional_attributes: Vec<(String, String)>) -> Result<u64, String>`

Mint NFT baru dari physical art session.

**Parameters:**

- `session_id` - ID session physical art
- `recipient` - Akun penerima NFT
- `additional_attributes` - Atribut tambahan untuk NFT

**Returns:**

- `Ok(token_id)` - Token ID yang baru di-mint
- `Err(message)` - Error message jika gagal

**Example:**

```bash
dfx canister call backend mint_nft_from_session '(
    "abc123",
    record { owner=principal "rrkah-fqaaa-aaaaa-aaaaq-cai"; subaccount=null },
    vec { record { "custom_attribute"; "custom_value" } }
)'
```

---

### get_session_nfts

**Type**: Query function  
**Signature**: `get_session_nfts(session_id: String) -> Vec<Token>`

Mengambil semua NFT yang terkait dengan session tertentu.

**Parameters:**

- `session_id` - ID session

**Returns:**

- `Vec<Token>` - Daftar NFT dari session

**Example:**

```bash
dfx canister call backend get_session_nfts '("abc123")'
```

---

### get_user_nfts

**Type**: Query function  
**Signature**: `get_user_nfts(owner: candid::Principal) -> Vec<Token>`

Mengambil semua NFT yang dimiliki oleh principal tertentu.

**Parameters:**

- `owner` - Principal pemilik

**Returns:**

- `Vec<Token>` - Daftar NFT milik user

**Example:**

```bash
dfx canister call backend get_user_nfts '(principal "rrkah-fqaaa-aaaaa-aaaaq-cai")'
```

---

### update_collection_metadata

**Type**: Update function  
**Signature**: `update_collection_metadata(name: String, description: Option<String>, image: Option<String>, max_supply: Option<u64>) -> Result<bool, String>`

Update metadata collection NFT.

**Parameters:**

- `name` - Nama collection baru
- `description` - Deskripsi collection (optional)
- `image` - URL gambar collection (optional)
- `max_supply` - Batas maksimum supply (optional)

**Returns:**

- `Ok(true)` - Berhasil update metadata
- `Err(message)` - Error message jika gagal

**Example:**

```bash
dfx canister call backend update_collection_metadata '(
    "Origin Stamp Art NFTs",
    opt "Updated description",
    opt "https://example.com/collection.jpg",
    opt 10000
)'
```

---

### get_token_details

**Type**: Query function  
**Signature**: `get_token_details(token_id: u64) -> Option<Token>`

Mengambil detail lengkap token berdasarkan ID.

**Parameters:**

- `token_id` - ID token

**Returns:**

- `Some(token)` - Detail token jika ditemukan
- `None` - Jika token tidak ditemukan

**Example:**

```bash
dfx canister call backend get_token_details '(1)'
```

## Helper Functions (Internal)

### simple_hash

**Type**: Internal function  
**Signature**: `simple_hash(password: &str) -> String`

Fungsi hash sederhana untuk password. **Note**: Dalam production, gunakan proper password hashing seperti bcrypt.

### generate_random_id

**Type**: Internal function  
**Signature**: `generate_random_id() -> String`

Generate ID acak untuk session menggunakan timestamp dan hash.

## Error Handling

Semua update functions menggunakan `Result<T, String>` untuk error handling:

- `Ok(value)` - Operasi berhasil
- `Err(message)` - Operasi gagal dengan pesan error

## Status Codes

### Session Status

- `"draft"` - Session baru dibuat
- `"in_progress"` - Session sedang aktif
- `"completed"` - Session selesai

## Usage Examples

### Complete Flow Example (Physical Art + NFT)

```bash
# 1. Register user
dfx canister call backend register_user '("artist1", "password123")'

# 2. Create session
SESSION_ID=$(dfx canister call backend create_physical_art_session '("artist1", "My Painting", "Oil on canvas")' | grep -o '"[^"]*"' | head -1 | tr -d '"')

# 3. Generate upload URL
dfx canister call backend generate_upload_url '("'$SESSION_ID'", record { filename="painting.jpg"; content_type="image/jpeg"; file_size=2048000 })'

# 4. Upload photo to session (after S3 upload)
dfx canister call backend upload_photo_to_session '("'$SESSION_ID'", "https://s3.amazonaws.com/bucket/painting.jpg")'

# 5. Update session status
dfx canister call backend update_session_status '("'$SESSION_ID'", "completed")'

# 6. Get session details
dfx canister call backend get_session_details '("'$SESSION_ID'")'

# 7. Mint NFT from session
TOKEN_ID=$(dfx canister call backend mint_nft_from_session '(
    "'$SESSION_ID'",
    record { owner=principal "rrkah-fqaaa-aaaaa-aaaaq-cai"; subaccount=null },
    vec { record { "edition"; "1/1" }; record { "medium"; "oil_on_canvas" } }
)' | grep -o '[0-9]*')

# 8. Get token details
dfx canister call backend get_token_details '('$TOKEN_ID')'

# 9. Check NFT balance
dfx canister call backend icrc7_balance_of '(vec { record { owner=principal "rrkah-fqaaa-aaaaa-aaaaq-cai"; subaccount=null } })'
```

### NFT Operations Example

```bash
# Get collection info
dfx canister call backend icrc7_collection_metadata

# Get total supply
dfx canister call backend icrc7_total_supply

# List all tokens (first 10)
dfx canister call backend icrc7_tokens '(null, opt 10)'

# Get tokens owned by a user
dfx canister call backend icrc7_tokens_of '(record { owner=principal "rrkah-fqaaa-aaaaa-aaaaq-cai"; subaccount=null }, null, opt 10)'

# Transfer NFT
dfx canister call backend icrc7_transfer '(vec {
    record {
        from=record { owner=principal "rrkah-fqaaa-aaaaa-aaaaq-cai"; subaccount=null };
        to=record { owner=principal "rdmx6-jaaaa-aaaah-qcaiq-cai"; subaccount=null };
        token_id=1;
        memo=null;
        created_at_time=null
    }
})'

# Get metadata for specific tokens
dfx canister call backend icrc7_token_metadata '(vec { 1; 2; 3 })'
```
