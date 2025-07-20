# S3 Integration Guide

## Overview

Sistem integrasi S3 di Origin Stamp ICP memungkinkan upload dan manajemen file untuk physical art sessions. Sistem ini mendukung S3-compatible storage dengan konfigurasi yang fleksibel.

## Architecture

```
Frontend Upload Request
    ↓
Backend Presigned URL Generation
    ↓
Direct S3 Upload
    ↓
Backend Upload Confirmation
    ↓
Session Photo Recording
```

## S3 Configuration

### S3Config Data Structure

```rust
pub struct S3Config {
    pub bucket_name: String,        // S3 bucket name
    pub region: String,             // AWS region
    pub access_key_id: String,      // AWS access key
    pub secret_access_key: String,  // AWS secret key
    pub endpoint: Option<String>,   // Custom endpoint (for S3-compatible)
}
```

### Storage

```rust
thread_local! {
    static S3_CONFIG: RefCell<Option<S3Config>> = RefCell::new(None);
}
```

## Core Functions

### Configure S3

```rust
#[ic_cdk::update]
fn configure_s3(config: S3Config) -> bool
```

**Purpose**: Mengkonfigurasi pengaturan S3 untuk canister.

**Example Usage:**

```bash
dfx canister call backend configure_s3 '(record {
    bucket_name = "my-artwork-bucket";
    region = "us-east-1";
    access_key_id = "AKIAIOSFODNN7EXAMPLE";
    secret_access_key = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY";
    endpoint = opt "https://s3.amazonaws.com"
})'
```

### Set S3 Config (Alias)

```rust
#[ic_cdk::update]
fn set_s3_config(config: S3Config) -> bool
```

Alias untuk `configure_s3()`.

### Get S3 Configuration

```rust
#[ic_cdk::query]
fn get_s3_config() -> Option<S3Config>
```

**Purpose**: Mengambil konfigurasi S3 saat ini (untuk testing/debugging).

**⚠️ Security Note**: Dalam production, jangan expose secret credentials melalui query functions.

### Get S3 Config Status

```rust
#[ic_cdk::query]
fn get_s3_config_status() -> bool
```

**Purpose**: Mengecek apakah S3 sudah dikonfigurasi tanpa mengexpose credentials.

**Example Usage:**

```bash
dfx canister call backend get_s3_config_status
# Result: (true) - S3 configured
# Result: (false) - S3 not configured
```

## Upload Flow

### 1. Generate Presigned URL

```rust
#[ic_cdk::update]
fn generate_upload_url(session_id: String, file_data: UploadFileData) -> Result<String, String>
```

**Current Implementation**: Returns placeholder URL

```rust
Ok(format!(
    "https://example.com/upload/{}/{}",
    session_id, file_data.filename
))
```

**Full Implementation (Future)**:

```rust
fn generate_s3_presigned_url(
    bucket: &str,
    key: &str,
    expires: u64,
    method: &str
) -> Result<String, String> {
    // AWS Signature V4 implementation
    // Generate presigned URL dengan proper authentication
}
```

### 2. Direct S3 Upload

Upload dilakukan langsung dari frontend ke S3 menggunakan presigned URL:

```javascript
// Frontend upload example
async function uploadToS3(file, presignedUrl) {
  const response = await fetch(presignedUrl, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type,
    },
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }

  return response;
}
```

### 3. Confirm Upload

```rust
#[ic_cdk::update]
fn upload_photo_to_session(session_id: String, photo_url: String) -> Result<bool, String>
```

Setelah upload berhasil, frontend memanggil fungsi ini untuk mencatat photo di session.

## Environment Configuration

### .env File

```bash
# S3 Configuration
S3_ACCESS_KEY=your_access_key_here
S3_SECRET_KEY=your_secret_key_here
S3_REGION=ap-southeast-1
S3_ENDPOINT=https://s3.csalab.dev/
S3_BUCKET_NAME=assets
```

### Automated Setup Script

```bash
#!/bin/bash
# scripts/setup-s3.sh

# Load environment variables
set -a
source .env
set +a

BACKEND_CANISTER_ID="${CANISTER_ID_BACKEND}"

if [ -z "$BACKEND_CANISTER_ID" ]; then
    echo "❌ Backend canister ID not found"
    exit 1
fi

# Configure S3
echo "🔧 Configuring S3 for backend canister: $BACKEND_CANISTER_ID"

dfx canister call "$BACKEND_CANISTER_ID" configure_s3 "(record {
    bucket_name=\"$S3_BUCKET_NAME\";
    region=\"$S3_REGION\";
    access_key_id=\"$S3_ACCESS_KEY\";
    secret_access_key=\"$S3_SECRET_KEY\";
    endpoint=opt \"$S3_ENDPOINT\"
})"

echo "✅ S3 configuration completed!"
```

## Security Considerations

### Environment Variables Security

⚠️ **Important Security Practice**: Never hardcode S3 credentials in source code.

**✅ Secure Approach:**

- Store credentials in `.env` file (excluded from git)
- Use environment variables in frontend/backend code
- Frontend components read from `process.env.S3_*`

**❌ Insecure Approach:**

```typescript
// DON'T DO THIS - hardcoded credentials
const s3Config = {
  access_key_id: "i92UDWO8CIztYanZJIC5", // Exposed in source code!
  secret_access_key: "7KSukKhPOE9Uz0zSGD2B5kKCobQAhCa2TZuoCgWT", // Never do this!
};
```

**✅ Secure Implementation:**

```typescript
// CORRECT - use environment variables
const s3Config = {
  bucket_name: process.env.S3_BUCKET_NAME || "",
  region: process.env.S3_REGION || "",
  access_key_id: process.env.S3_ACCESS_KEY || "",
  secret_access_key: process.env.S3_SECRET_KEY || "",
  endpoint: [process.env.S3_ENDPOINT || ""] as [] | [string],
};
```

### Additional Security Measures

1. **Environment File Protection**

   - Add `.env` to `.gitignore`
   - Never commit `.env` files to version control
   - Use `.env.example` for documentation

2. **Access Key Management**

   - Use IAM roles with minimal required permissions
   - Rotate access keys regularly
   - Use separate credentials for development/production

3. **Frontend Environment Variables**
   - Vite requires `S3_` prefix in environment plugin
   - Variables are exposed to client-side code
   - Consider using backend proxy for sensitive operations

## S3-Compatible Services

### Supported Services

- ✅ **Amazon S3** - Standard AWS S3
- ✅ **MinIO** - Self-hosted S3-compatible storage
- ✅ **DigitalOcean Spaces** - S3-compatible object storage
- ✅ **Custom S3** - Any S3-compatible API

### Configuration Examples

#### Amazon S3

```bash
S3_ENDPOINT=https://s3.amazonaws.com
S3_REGION=us-east-1
S3_BUCKET_NAME=my-bucket
S3_ACCESS_KEY=AKIAIOSFODNN7EXAMPLE
S3_SECRET_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

#### MinIO

```bash
S3_ENDPOINT=https://minio.myserver.com
S3_REGION=us-east-1  # Can be any value for MinIO
S3_BUCKET_NAME=artwork-storage
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
```

#### DigitalOcean Spaces

```bash
S3_ENDPOINT=https://nyc3.digitaloceanspaces.com
S3_REGION=nyc3
S3_BUCKET_NAME=my-space
S3_ACCESS_KEY=DO_ACCESS_KEY
S3_SECRET_KEY=DO_SECRET_KEY
```

## Frontend Integration

### TypeScript Service

```typescript
// services/s3Service.ts
export class S3Service {
  static async generateUploadUrl(
    sessionId: string,
    filename: string,
    contentType: string,
    fileSize: number,
  ): Promise<string> {
    const uploadFileData = {
      filename,
      content_type: contentType,
      file_size: BigInt(fileSize),
    };

    const result = await backend.generate_upload_url(sessionId, uploadFileData);

    if ("Ok" in result) {
      return result.Ok;
    } else {
      throw new Error(result.Err);
    }
  }

  static async uploadFile(file: File, uploadUrl: string): Promise<Response> {
    const response = await fetch(uploadUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
        "Content-Length": file.size.toString(),
      },
    });

    if (!response.ok) {
      throw new Error(
        `Upload failed: ${response.status} ${response.statusText}`,
      );
    }

    return response;
  }

  static async confirmUpload(
    sessionId: string,
    photoUrl: string,
  ): Promise<boolean> {
    const result = await backend.upload_photo_to_session(sessionId, photoUrl);

    if ("Ok" in result) {
      return result.Ok;
    } else {
      throw new Error(result.Err);
    }
  }

  static async checkS3Status(): Promise<boolean> {
    return await backend.get_s3_config_status();
  }
}
```

### React Upload Component

```typescript
// components/FileUploader.tsx
import React, { useState } from 'react';
import { S3Service } from '../services/s3Service';

interface FileUploaderProps {
  sessionId: string;
  onUploadComplete?: (photoUrl: string) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  sessionId,
  onUploadComplete
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    setUploadProgress(0);

    try {
      // 1. Generate presigned URL
      setUploadProgress(25);
      const uploadUrl = await S3Service.generateUploadUrl(
        sessionId,
        file.name,
        file.type,
        file.size
      );

      // 2. Upload to S3
      setUploadProgress(50);
      await S3Service.uploadFile(file, uploadUrl);

      // 3. Confirm upload
      setUploadProgress(75);
      const photoUrl = `https://s3.amazonaws.com/bucket/${file.name}`;
      await S3Service.confirmUpload(sessionId, photoUrl);

      setUploadProgress(100);
      onUploadComplete?.(photoUrl);

    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="file-uploader">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileUpload(file);
        }}
        disabled={uploading}
      />

      {uploading && (
        <div className="upload-progress">
          <div>Uploading... {uploadProgress}%</div>
          <progress value={uploadProgress} max={100} />
        </div>
      )}
    </div>
  );
};

export default FileUploader;
```

## Admin Panel Integration

### S3 Configuration Panel

```typescript
// components/admin/S3ConfigPanel.tsx
import React, { useState, useEffect } from 'react';
import { backend } from '../../../declarations/backend';

const S3ConfigPanel: React.FC = () => {
  const [config, setConfig] = useState({
    bucket_name: '',
    region: '',
    access_key_id: '',
    secret_access_key: '',
    endpoint: '',
  });
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    checkS3Status();
  }, []);

  const checkS3Status = async () => {
    try {
      const status = await backend.get_s3_config_status();
      setIsConfigured(status);
    } catch (error) {
      console.error('Failed to check S3 status:', error);
    }
  };

  const saveConfig = async () => {
    try {
      const s3Config = {
        bucket_name: config.bucket_name,
        region: config.region,
        access_key_id: config.access_key_id,
        secret_access_key: config.secret_access_key,
        endpoint: config.endpoint ? [config.endpoint] : [],
      };

      const result = await backend.configure_s3(s3Config);
      if (result) {
        setIsConfigured(true);
        alert('S3 configuration saved successfully!');
      } else {
        alert('Failed to save S3 configuration');
      }
    } catch (error) {
      console.error('Failed to save S3 config:', error);
      alert('Error saving S3 configuration');
    }
  };

  return (
    <div className="s3-config-panel">
      <h3>S3 Configuration</h3>

      <div className="status">
        Status: {isConfigured ? '✅ Configured' : '❌ Not Configured'}
      </div>

      <div className="config-form">
        <input
          type="text"
          placeholder="Bucket Name"
          value={config.bucket_name}
          onChange={(e) => setConfig({...config, bucket_name: e.target.value})}
        />

        <input
          type="text"
          placeholder="Region"
          value={config.region}
          onChange={(e) => setConfig({...config, region: e.target.value})}
        />

        <input
          type="text"
          placeholder="Access Key ID"
          value={config.access_key_id}
          onChange={(e) => setConfig({...config, access_key_id: e.target.value})}
        />

        <input
          type="password"
          placeholder="Secret Access Key"
          value={config.secret_access_key}
          onChange={(e) => setConfig({...config, secret_access_key: e.target.value})}
        />

        <input
          type="text"
          placeholder="Endpoint (optional)"
          value={config.endpoint}
          onChange={(e) => setConfig({...config, endpoint: e.target.value})}
        />

        <button onClick={saveConfig}>Save Configuration</button>
      </div>
    </div>
  );
};

export default S3ConfigPanel;
```

## Security Considerations

### Current Implementation

- ✅ S3 credentials stored in canister memory
- ✅ Environment variable support
- ❌ Credentials exposure via get_s3_config query
- ❌ No access control for S3 configuration

### Production Recommendations

1. **Remove Credential Exposure**

   ```rust
   // Remove this function in production
   // #[ic_cdk::query]
   // fn get_s3_config() -> Option<S3Config>
   ```

2. **Access Control**

   ```rust
   // Add admin role checking
   fn require_admin() -> Result<(), String> {
       let caller = ic_cdk::caller();
       if !is_admin(caller) {
           return Err("Admin access required".to_string());
       }
       Ok(())
   }

   #[ic_cdk::update]
   fn configure_s3(config: S3Config) -> Result<bool, String> {
       require_admin()?;
       // ... existing logic
       Ok(true)
   }
   ```

3. **Credential Encryption**

   ```rust
   use aes_gcm::{Aes256Gcm, Key, Nonce, aead::Aead};

   fn encrypt_credentials(credentials: &str) -> Result<Vec<u8>, String> {
       // Implement AES-256-GCM encryption
   }
   ```

4. **Temporary Credentials**
   ```rust
   // Use STS tokens instead of permanent credentials
   struct STSCredentials {
       access_key: String,
       secret_key: String,
       session_token: String,
       expires_at: u64,
   }
   ```

## Testing

### S3 Configuration Testing

```bash
#!/bin/bash
# test-s3-config.sh

BACKEND_CANISTER_ID="your-canister-id"

# Test S3 status (should be false initially)
echo "Testing S3 status before configuration..."
dfx canister call "$BACKEND_CANISTER_ID" get_s3_config_status

# Configure S3
echo "Configuring S3..."
dfx canister call "$BACKEND_CANISTER_ID" configure_s3 '(record {
    bucket_name="test-bucket";
    region="us-east-1";
    access_key_id="test-key";
    secret_access_key="test-secret";
    endpoint=opt "https://s3.amazonaws.com"
})'

# Test S3 status (should be true after configuration)
echo "Testing S3 status after configuration..."
dfx canister call "$BACKEND_CANISTER_ID" get_s3_config_status
```

### Upload Flow Testing

```bash
#!/bin/bash
# test-upload-flow.sh

BACKEND_CANISTER_ID="your-canister-id"
SESSION_ID="test-session-id"

# 1. Create test session
echo "Creating test session..."
SESSION_RESULT=$(dfx canister call "$BACKEND_CANISTER_ID" create_physical_art_session '("test_user", "Test Art", "Testing upload")')
SESSION_ID=$(echo "$SESSION_RESULT" | grep -o '"[^"]*"' | tr -d '"')

echo "Created session: $SESSION_ID"

# 2. Generate upload URL
echo "Generating upload URL..."
UPLOAD_RESULT=$(dfx canister call "$BACKEND_CANISTER_ID" generate_upload_url "($SESSION_ID, record { filename=\"test.jpg\"; content_type=\"image/jpeg\"; file_size=1024 })")
echo "Upload URL result: $UPLOAD_RESULT"

# 3. Test upload confirmation
echo "Testing upload confirmation..."
dfx canister call "$BACKEND_CANISTER_ID" upload_photo_to_session "($SESSION_ID, \"https://s3.amazonaws.com/test-bucket/test.jpg\")"

# 4. Verify session details
echo "Checking session details..."
dfx canister call "$BACKEND_CANISTER_ID" get_session_details "($SESSION_ID)"
```

## Deployment Integration

### DFX Configuration

```json
// dfx.json
{
  "canisters": {
    "backend": {
      "type": "rust",
      "post_deploy": ["bash ./scripts/setup-s3.sh"]
    }
  }
}
```

### NPM Scripts

```json
// package.json
{
  "scripts": {
    "deploy": "dfx deploy",
    "deploy:with-s3": "dfx deploy && ./scripts/setup-s3.sh",
    "setup:s3": "./scripts/setup-s3.sh",
    "test:s3": "./test-s3-config.sh"
  }
}
```

## Future Enhancements

### Planned Features

- [ ] **Real AWS Signature V4**: Implement proper presigned URL generation
- [ ] **Multi-region Support**: Support for multiple S3 regions
- [ ] **CDN Integration**: CloudFront/CDN support for faster access
- [ ] **Image Processing**: On-the-fly image resizing and optimization
- [ ] **Backup Strategy**: Automatic backup to multiple storage providers

### Advanced Features

- [ ] **Chunked Upload**: Support for large file uploads
- [ ] **Resume Upload**: Resume interrupted uploads
- [ ] **Batch Operations**: Bulk upload/delete operations
- [ ] **Storage Analytics**: Usage statistics and cost tracking
- [ ] **Content Deduplication**: Avoid storing duplicate files

### Integration Improvements

- [ ] **CORS Configuration**: Automated CORS setup for S3 buckets
- [ ] **Lifecycle Policies**: Automatic file archival and cleanup
- [ ] **Access Logging**: Track all S3 operations
- [ ] **Monitoring**: Real-time S3 operation monitoring
