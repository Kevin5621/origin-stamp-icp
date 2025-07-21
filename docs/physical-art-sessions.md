# Physical Art Sessions Management

## Overview

Sistem Physical Art Sessions mengelola sesi upload dan tracking untuk physical artwork. Setiap sesi merepresentasikan satu karya seni fisik dengan metadata dan foto-foto prosesnya.

## Architecture

```
User Creates Session
    ↓
Session Storage (HashMap)
    ↓
Photo Upload Management
    ↓
Status Tracking
    ↓
Session Completion
```

## Data Structure

### PhysicalArtSession Model

```rust
pub struct PhysicalArtSession {
    pub session_id: String,        // Unique identifier
    pub username: String,          // Session owner
    pub art_title: String,         // Artwork title
    pub description: String,       // Artwork description
    pub uploaded_photos: Vec<String>, // Photo URLs
    pub status: String,            // Session status
    pub created_at: u64,          // Creation timestamp
    pub updated_at: u64,          // Last update timestamp
}
```

### UploadFileData Model

```rust
pub struct UploadFileData {
    pub filename: String,          // Original filename
    pub content_type: String,      // MIME type
    pub file_size: u64,           // File size in bytes
}
```

## Session Lifecycle

### 1. Session Creation

```
Draft → In Progress → Completed
```

### Status Definitions

- **`"draft"`** - Session baru dibuat, belum ada upload
- **`"in_progress"`** - Session aktif, ada foto yang diupload
- **`"completed"`** - Session selesai, semua foto sudah diupload

## Core Functions

### Create Physical Art Session

```rust
#[ic_cdk::update]
fn create_physical_art_session(
    username: String,
    art_title: String,
    description: String,
) -> Result<String, String>
```

**Process Flow:**

1. Generate unique session ID menggunakan timestamp
2. Create session object dengan status "draft"
3. Store session di HashMap
4. Return session ID

**Example Usage:**

```bash
dfx canister call backend create_physical_art_session '("artist1", "Sunset Painting", "Oil painting of beautiful sunset")'
# Result: (variant { Ok = "1a2b3c4d5e" })
```

### Generate Upload URL

```rust
#[ic_cdk::update]
fn generate_upload_url(session_id: String, file_data: UploadFileData) -> Result<String, String>
```

**Process Flow:**

1. Validate session exists
2. Generate presigned S3 URL (current: placeholder)
3. Return upload URL

**Example Usage:**

```bash
dfx canister call backend generate_upload_url '("1a2b3c4d5e", record { filename="process1.jpg"; content_type="image/jpeg"; file_size=2048000 })'
# Result: (variant { Ok = "https://your-bucket.s3.your-region.amazonaws.com/1a2b3c4d5e/process1.jpg" })
# Or with custom endpoint: (variant { Ok = "https://your-s3-endpoint.com/your-bucket/1a2b3c4d5e/process1.jpg" })
```

### Upload Photo to Session

```rust
#[ic_cdk::update]
fn upload_photo_to_session(session_id: String, photo_url: String) -> Result<bool, String>
```

**Process Flow:**

1. Find session by ID
2. Add photo URL to uploaded_photos vector
3. Update timestamp
4. Return success status

**Example Usage:**

```bash
dfx canister call backend upload_photo_to_session '("1a2b3c4d5e", "https://s3.amazonaws.com/bucket/photo1.jpg")'
# Result: (variant { Ok = true })
```

### Get Session Details

```rust
#[ic_cdk::query]
fn get_session_details(session_id: String) -> Option<PhysicalArtSession>
```

**Example Usage:**

```bash
dfx canister call backend get_session_details '("1a2b3c4d5e")'
# Result: (opt record { session_id="1a2b3c4d5e"; username="artist1"; ... })
```

### Get User Sessions

```rust
#[ic_cdk::query]
fn get_user_sessions(username: String) -> Vec<PhysicalArtSession>
```

Mengembalikan semua session milik user tertentu.

**Example Usage:**

```bash
dfx canister call backend get_user_sessions '("artist1")'
# Result: (vec { record { session_id="1a2b3c4d5e"; ... }; record { session_id="2b3c4d5e6f"; ... } })
```

### Update Session Status

```rust
#[ic_cdk::update]
fn update_session_status(session_id: String, status: String) -> Result<bool, String>
```

**Example Usage:**

```bash
dfx canister call backend update_session_status '("1a2b3c4d5e", "completed")'
# Result: (variant { Ok = true })
```

### Remove Photo from Session

```rust
#[ic_cdk::update]
fn remove_photo_from_session(session_id: String, photo_url: String) -> Result<bool, String>
```

**Example Usage:**

```bash
dfx canister call backend remove_photo_from_session '("1a2b3c4d5e", "https://s3.amazonaws.com/bucket/photo1.jpg")'
# Result: (variant { Ok = true })
```

## Session ID Generation

### Algorithm

```rust
fn generate_random_id() -> String {
    let timestamp = ic_cdk::api::time();
    let random_part = simple_hash(&timestamp.to_string());
    format!(
        "{:x}{:x}",
        timestamp & 0xFFFFFFFF,
        random_part
            .chars()
            .take(8)
            .collect::<String>()
            .parse::<u32>()
            .unwrap_or(0)
    )
}
```

**Characteristics:**

- **Unique**: Menggunakan timestamp IC
- **Short**: Hex format untuk readability
- **Collision-resistant**: Timestamp + hash combination

## Data Storage

### Storage Implementation

```rust
thread_local! {
    static PHYSICAL_ART_SESSIONS: RefCell<HashMap<String, PhysicalArtSession>> =
        RefCell::new(HashMap::new());
}
```

**Features:**

- **Persistent**: Data tersimpan di canister memory
- **Fast Access**: O(1) lookup berdasarkan session_id
- **Thread-safe**: RefCell untuk interior mutability
- **Scalable**: HashMap dapat menangani banyak sessions

## Complete Workflow Examples

### 1. Basic Session Creation and Upload

```bash
# 1. Create session
SESSION_ID=$(dfx canister call backend create_physical_art_session '("artist1", "My Artwork", "Description")' | grep -o '"[^"]*"' | head -1 | tr -d '"')

echo "Created session: $SESSION_ID"

# 2. Generate upload URL
dfx canister call backend generate_upload_url "($SESSION_ID, record { filename=\"process1.jpg\"; content_type=\"image/jpeg\"; file_size=1024000 })"

# 3. Upload photo (after S3 upload)
dfx canister call backend upload_photo_to_session "($SESSION_ID, \"https://s3.amazonaws.com/bucket/process1.jpg\")"

# 4. Update status
dfx canister call backend update_session_status "($SESSION_ID, \"in_progress\")"

# 5. Get session details
dfx canister call backend get_session_details "($SESSION_ID)"
```

### 2. Multiple Photo Upload Workflow

```bash
#!/bin/bash

SESSION_ID="1a2b3c4d5e"
PHOTOS=("process1.jpg" "process2.jpg" "final.jpg")

for photo in "${PHOTOS[@]}"; do
    echo "Uploading $photo..."

    # Generate upload URL
    url_result=$(dfx canister call backend generate_upload_url "($SESSION_ID, record { filename=\"$photo\"; content_type=\"image/jpeg\"; file_size=1024000 })")

    # Extract URL (simplified)
    upload_url=$(echo "$url_result" | grep -o 'https://[^"]*')

    # Simulate S3 upload (replace with actual upload)
    echo "Would upload to: $upload_url"

    # Record upload
    dfx canister call backend upload_photo_to_session "($SESSION_ID, \"https://s3.amazonaws.com/bucket/$photo\")"
done

# Complete session
dfx canister call backend update_session_status "($SESSION_ID, \"completed\")"
```

## Frontend Integration

### TypeScript Service Example

```typescript
// services/physicalArtService.ts
import { backend } from "../../declarations/backend";
import type {
  PhysicalArtSession,
  UploadFileData,
} from "../../declarations/backend/backend.did";

export class PhysicalArtService {
  static async createSession(
    username: string,
    artTitle: string,
    description: string,
  ): Promise<string> {
    try {
      const result = await backend.create_physical_art_session(
        username,
        artTitle,
        description,
      );

      if ("Ok" in result) {
        return result.Ok;
      } else {
        throw new Error(result.Err);
      }
    } catch (error) {
      console.error("Failed to create session:", error);
      throw error;
    }
  }

  static async generateUploadUrl(
    sessionId: string,
    filename: string,
    contentType: string,
  ): Promise<string> {
    try {
      const uploadFileData: UploadFileData = {
        filename,
        content_type: contentType,
        file_size: BigInt(0), // Will be set during actual upload
      };

      const result = await backend.generate_upload_url(
        sessionId,
        uploadFileData,
      );

      if ("Ok" in result) {
        return result.Ok;
      } else {
        throw new Error(result.Err);
      }
    } catch (error) {
      console.error("Failed to generate upload URL:", error);
      throw error;
    }
  }

  static async uploadPhotoToSession(
    sessionId: string,
    photoUrl: string,
  ): Promise<boolean> {
    try {
      const result = await backend.upload_photo_to_session(sessionId, photoUrl);

      if ("Ok" in result) {
        return result.Ok;
      } else {
        throw new Error(result.Err);
      }
    } catch (error) {
      console.error("Failed to record upload:", error);
      throw error;
    }
  }

  static async getUserSessions(
    username: string,
  ): Promise<PhysicalArtSession[]> {
    try {
      return await backend.get_user_sessions(username);
    } catch (error) {
      console.error("Failed to get user sessions:", error);
      throw error;
    }
  }

  static async updateSessionStatus(
    sessionId: string,
    status: string,
  ): Promise<boolean> {
    try {
      const result = await backend.update_session_status(sessionId, status);

      if ("Ok" in result) {
        return result.Ok;
      } else {
        throw new Error(result.Err);
      }
    } catch (error) {
      console.error("Failed to update session status:", error);
      throw error;
    }
  }
}
```

### React Component Example

```typescript
// components/PhysicalArtSetup.tsx
import React, { useState } from 'react';
import { PhysicalArtService } from '../services/physicalArtService';

interface PhysicalArtSetupProps {
  username: string;
}

const PhysicalArtSetup: React.FC<PhysicalArtSetupProps> = ({ username }) => {
  const [artTitle, setArtTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);

  const createSession = async () => {
    try {
      const id = await PhysicalArtService.createSession(
        username,
        artTitle,
        description
      );
      setSessionId(id);
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  };

  const uploadFiles = async () => {
    if (!sessionId || !selectedFiles) return;

    setUploading(true);

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];

        // Generate upload URL
        const uploadUrl = await PhysicalArtService.generateUploadUrl(
          sessionId,
          file.name,
          file.type
        );

        // Upload to S3 (simplified - actual implementation would upload to S3)
        const s3Url = `https://s3.amazonaws.com/bucket/${file.name}`;

        // Record upload
        await PhysicalArtService.uploadPhotoToSession(sessionId, s3Url);
      }

      // Update session status
      await PhysicalArtService.updateSessionStatus(sessionId, 'completed');

    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="physical-art-setup">
      <h2>Physical Art Setup</h2>

      {!sessionId ? (
        <div>
          <input
            type="text"
            placeholder="Art Title"
            value={artTitle}
            onChange={(e) => setArtTitle(e.target.value)}
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button onClick={createSession}>Create Session</button>
        </div>
      ) : (
        <div>
          <p>Session ID: {sessionId}</p>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setSelectedFiles(e.target.files)}
          />
          <button onClick={uploadFiles} disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload Photos'}
          </button>
        </div>
      )}
    </div>
  );
};

export default PhysicalArtSetup;
```

## Error Handling

### Common Error Scenarios

1. **Session Not Found**

   ```rust
   Err("Session not found".to_string())
   ```

2. **Invalid Session ID**

   ```rust
   // Check session existence before operations
   match sessions_map.get_mut(&session_id) {
       Some(session) => { /* operation */ }
       None => Err("Session not found".to_string())
   }
   ```

3. **Empty Input Validation**
   ```rust
   if username.is_empty() || art_title.is_empty() {
       return Err("Username and title cannot be empty".to_string());
   }
   ```

## Performance Considerations

### Current Implementation

- **Time Complexity**: O(1) for session lookup
- **Space Complexity**: O(n) where n is number of sessions
- **Memory Usage**: Sessions stored in canister memory

### Scalability Recommendations

1. **Pagination for Large Lists**

   ```rust
   #[ic_cdk::query]
   fn get_user_sessions_paginated(
       username: String,
       page: u32,
       limit: u32
   ) -> (Vec<PhysicalArtSession>, bool) // (sessions, has_more)
   ```

2. **Session Archival**

   ```rust
   #[ic_cdk::update]
   fn archive_old_sessions(days_old: u32) -> u32 // archived count
   ```

3. **Memory Management**
   ```rust
   #[ic_cdk::query]
   fn get_storage_stats() -> (usize, usize) // (active_sessions, total_photos)
   ```

## Testing

### Unit Tests

```bash
# Test session creation
dfx canister call backend create_physical_art_session '("test_user", "Test Art", "Test Description")'

# Test multiple sessions for same user
dfx canister call backend create_physical_art_session '("test_user", "Art 2", "Second artwork")'

# Test session retrieval
dfx canister call backend get_user_sessions '("test_user")'

# Test photo upload
SESSION_ID="your_session_id_here"
dfx canister call backend upload_photo_to_session "($SESSION_ID, \"https://example.com/photo1.jpg\")"

# Test status update
dfx canister call backend update_session_status "($SESSION_ID, \"completed\")"
```

### Load Testing

```bash
#!/bin/bash

# Create multiple sessions
USER="load_test_user"
for i in {1..50}; do
    dfx canister call backend create_physical_art_session "($USER, \"Art $i\", \"Load test artwork $i\")"
done

# Check performance
time dfx canister call backend get_user_sessions "($USER)"
```

## Future Enhancements

### Planned Features

- [ ] Session templates for recurring artworks
- [ ] Batch photo upload
- [ ] Session sharing and collaboration
- [ ] Progress tracking with percentages
- [ ] Session categories/tags
- [ ] Export session data
- [ ] Session analytics and reports

### Advanced Features

- [ ] Version control for session updates
- [ ] Session backup and restore
- [ ] Real-time session updates via subscriptions
- [ ] Session search and filtering
- [ ] Integration with external art platforms
