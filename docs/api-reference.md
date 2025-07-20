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

### Complete Flow Example

```bash
# 1. Register user
dfx canister call backend register_user '("artist1", "password123")'

# 2. Create session
dfx canister call backend create_physical_art_session '("artist1", "My Painting", "Oil on canvas")'

# 3. Generate upload URL
dfx canister call backend generate_upload_url '("session_id_here", record { filename="painting.jpg"; content_type="image/jpeg"; file_size=2048000 })'

# 4. Upload photo to session (after S3 upload)
dfx canister call backend upload_photo_to_session '("session_id_here", "https://s3.amazonaws.com/bucket/painting.jpg")'

# 5. Update session status
dfx canister call backend update_session_status '("session_id_here", "completed")'

# 6. Get session details
dfx canister call backend get_session_details '("session_id_here")'
```
