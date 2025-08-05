# Frontend API Integration Guide

Dokumentasi lengkap untuk mengintegrasikan semua fungsi backend canister dengan frontend aplikasi Origin Stamp ICP.

## Overview

Dokumen ini berisi daftar lengkap semua fungsi API yang tersedia dan contoh implementasi di frontend menggunakan React + TypeScript.

## Setup Frontend Integration

Pertama, pastikan Anda telah mengimpor canister declarations:

```typescript
import { backend } from "../../declarations/backend";
import type {
  LoginResult,
  PhysicalArtSession,
  UploadFileData,
  S3Config,
  Account,
  Token,
  TokenMetadata,
  TransferRequest,
  CollectionMetadata,
} from "../../declarations/backend/backend.did.d.ts";
```

## User Management Functions

### 1. register_user

**Type**: Update Function  
**Signature**: `register_user(username: string, password: string) -> LoginResult`

```typescript
// Frontend Service
export const registerUser = async (username: string, password: string): Promise<LoginResult> => {
  try {
    const result = await backend.register_user(username, password);
    return result;
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
};

// React Component Usage
const RegisterComponent = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    try {
      const result = await registerUser(username, password);
      if (result.success) {
        console.log("Registration successful:", result.message);
        // Redirect or update UI
      } else {
        console.error("Registration failed:", result.message);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleRegister} disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </button>
    </div>
  );
};
```

### 2. login

**Type**: Update Function  
**Signature**: `login(username: string, password: string) -> LoginResult`

```typescript
// Frontend Service
export const loginUser = async (username: string, password: string): Promise<LoginResult> => {
  try {
    const result = await backend.login(username, password);
    return result;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

// React Component Usage
const LoginComponent = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const result = await loginUser(credentials.username, credentials.password);
      if (result.success) {
        // Store user session, redirect, etc.
        localStorage.setItem("currentUser", result.username!);
        console.log("Login successful");
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
      <input
        value={credentials.username}
        onChange={(e) => setCredentials({...credentials, username: e.target.value})}
        placeholder="Username"
        required
      />
      <input
        type="password"
        value={credentials.password}
        onChange={(e) => setCredentials({...credentials, password: e.target.value})}
        placeholder="Password"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};
```

### 3. get_all_users

**Type**: Query Function  
**Signature**: `get_all_users() -> string[]`

```typescript
// Frontend Service
export const getAllUsers = async (): Promise<string[]> => {
  try {
    const users = await backend.get_all_users();
    return users;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw error;
  }
};

// React Component Usage
const UserListComponent = () => {
  const [users, setUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userList = await getAllUsers();
        setUsers(userList);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div>Loading users...</div>;

  return (
    <div>
      <h3>Registered Users ({users.length})</h3>
      <ul>
        {users.map((username, index) => (
          <li key={index}>{username}</li>
        ))}
      </ul>
    </div>
  );
};
```

### 4. get_user_info

**Type**: Query Function  
**Signature**: `get_user_info(username: string) -> [string, bigint] | []`

```typescript
// Frontend Service
export const getUserInfo = async (username: string): Promise<[string, bigint] | null> => {
  try {
    const result = await backend.get_user_info(username);
    return result.length > 0 ? result : null;
  } catch (error) {
    console.error("Failed to fetch user info:", error);
    throw error;
  }
};

// React Component Usage
const UserProfileComponent = ({ username }: { username: string }) => {
  const [userInfo, setUserInfo] = useState<[string, bigint] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const info = await getUserInfo(username);
        setUserInfo(info);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [username]);

  if (loading) return <div>Loading user info...</div>;
  if (!userInfo) return <div>User not found</div>;

  const [name, createdAt] = userInfo;
  const createdDate = new Date(Number(createdAt) / 1000000); // Convert nanoseconds to milliseconds

  return (
    <div>
      <h3>User Profile</h3>
      <p><strong>Username:</strong> {name}</p>
      <p><strong>Member since:</strong> {createdDate.toLocaleDateString()}</p>
    </div>
  );
};
```

### 5. get_user_count

**Type**: Query Function  
**Signature**: `get_user_count() -> number`

```typescript
// Frontend Service
export const getUserCount = async (): Promise<number> => {
  try {
    const count = await backend.get_user_count();
    return Number(count);
  } catch (error) {
    console.error("Failed to fetch user count:", error);
    throw error;
  }
};

// React Component Usage
const UserStatsComponent = () => {
  const [userCount, setUserCount] = useState<number>(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const count = await getUserCount();
        setUserCount(count);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="stats-card">
      <h3>Platform Statistics</h3>
      <p>Total Registered Users: <strong>{userCount}</strong></p>
    </div>
  );
};
```

## Physical Art Session Functions

### 6. create_physical_art_session

**Type**: Update Function  
**Signature**: `create_physical_art_session(username: string, art_title: string, description: string) -> { Ok: string } | { Err: string }`

```typescript
// Frontend Service
export const createPhysicalArtSession = async (
  username: string,
  artTitle: string,
  description: string
): Promise<string> => {
  try {
    const result = await backend.create_physical_art_session(username, artTitle, description);
    if ('Ok' in result) {
      return result.Ok;
    } else {
      throw new Error(result.Err);
    }
  } catch (error) {
    console.error("Failed to create session:", error);
    throw error;
  }
};

// React Component Usage
const CreateSessionComponent = () => {
  const [formData, setFormData] = useState({
    artTitle: "",
    description: ""
  });
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const currentUser = localStorage.getItem("currentUser");
      if (!currentUser) {
        alert("Please login first");
        return;
      }

      const newSessionId = await createPhysicalArtSession(
        currentUser,
        formData.artTitle,
        formData.description
      );

      setSessionId(newSessionId);
      console.log("Session created successfully:", newSessionId);

      // Reset form
      setFormData({ artTitle: "", description: "" });
    } catch (error) {
      console.error("Error creating session:", error);
      alert("Failed to create session");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Art Title:</label>
          <input
            value={formData.artTitle}
            onChange={(e) => setFormData({...formData, artTitle: e.target.value})}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Session"}
        </button>
      </form>

      {sessionId && (
        <div className="success-message">
          <p>Session created successfully!</p>
          <p>Session ID: <code>{sessionId}</code></p>
        </div>
      )}
    </div>
  );
};
```

### 7. generate_upload_url

**Type**: Update Function  
**Signature**: `generate_upload_url(session_id: string, file_data: UploadFileData) -> { Ok: string } | { Err: string }`

```typescript
// Frontend Service
export const generateUploadUrl = async (
  sessionId: string,
  fileData: UploadFileData
): Promise<string> => {
  try {
    const result = await backend.generate_upload_url(sessionId, fileData);
    if ('Ok' in result) {
      return result.Ok;
    } else {
      throw new Error(result.Err);
    }
  } catch (error) {
    console.error("Failed to generate upload URL:", error);
    throw error;
  }
};

// React Component Usage
const FileUploadComponent = ({ sessionId }: { sessionId: string }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedFile(file || null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      // Generate upload URL
      const uploadUrl = await generateUploadUrl(sessionId, {
        filename: selectedFile.name,
        content_type: selectedFile.type,
        file_size: BigInt(selectedFile.size)
      });

      // Upload file to S3 (or other storage)
      const formData = new FormData();
      formData.append('file', selectedFile);

      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: selectedFile,
        headers: {
          'Content-Type': selectedFile.type,
        },
      });

      if (uploadResponse.ok) {
        // Record the uploaded photo
        await uploadPhotoToSession(sessionId, uploadUrl);
        console.log("Upload successful");
        setSelectedFile(null);
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={uploading}
      />
      {selectedFile && (
        <div>
          <p>Selected: {selectedFile.name}</p>
          <button onClick={handleUpload} disabled={uploading}>
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      )}
    </div>
  );
};
```

### 8. upload_photo_to_session

**Type**: Update Function  
**Signature**: `upload_photo_to_session(session_id: string, photo_url: string) -> { Ok: boolean } | { Err: string }`

```typescript
// Frontend Service
export const uploadPhotoToSession = async (
  sessionId: string,
  photoUrl: string,
): Promise<boolean> => {
  try {
    const result = await backend.upload_photo_to_session(sessionId, photoUrl);
    if ("Ok" in result) {
      return result.Ok;
    } else {
      throw new Error(result.Err);
    }
  } catch (error) {
    console.error("Failed to record photo upload:", error);
    throw error;
  }
};
```

### 9. get_session_details

**Type**: Query Function  
**Signature**: `get_session_details(session_id: string) -> PhysicalArtSession | []`

```typescript
// Frontend Service
export const getSessionDetails = async (sessionId: string): Promise<PhysicalArtSession | null> => {
  try {
    const result = await backend.get_session_details(sessionId);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("Failed to fetch session details:", error);
    throw error;
  }
};

// React Component Usage
const SessionDetailsComponent = ({ sessionId }: { sessionId: string }) => {
  const [session, setSession] = useState<PhysicalArtSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const sessionData = await getSessionDetails(sessionId);
        setSession(sessionData);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  if (loading) return <div>Loading session...</div>;
  if (!session) return <div>Session not found</div>;

  return (
    <div className="session-details">
      <h3>{session.art_title}</h3>
      <p><strong>Artist:</strong> {session.username}</p>
      <p><strong>Description:</strong> {session.description}</p>
      <p><strong>Status:</strong> {session.status}</p>
      <p><strong>Created:</strong> {new Date(Number(session.created_at) / 1000000).toLocaleString()}</p>

      {session.uploaded_photos.length > 0 && (
        <div>
          <h4>Photos ({session.uploaded_photos.length})</h4>
          <div className="photo-gallery">
            {session.uploaded_photos.map((url, index) => (
              <img key={index} src={url} alt={`Photo ${index + 1}`} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
```

### 10. get_user_sessions

**Type**: Query Function  
**Signature**: `get_user_sessions(username: string) -> PhysicalArtSession[]`

```typescript
// Frontend Service
export const getUserSessions = async (username: string): Promise<PhysicalArtSession[]> => {
  try {
    const sessions = await backend.get_user_sessions(username);
    return sessions;
  } catch (error) {
    console.error("Failed to fetch user sessions:", error);
    throw error;
  }
};

// React Component Usage
const UserSessionsComponent = ({ username }: { username: string }) => {
  const [sessions, setSessions] = useState<PhysicalArtSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const userSessions = await getUserSessions(username);
        setSessions(userSessions);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [username]);

  if (loading) return <div>Loading sessions...</div>;

  return (
    <div>
      <h3>My Art Sessions ({sessions.length})</h3>
      {sessions.length === 0 ? (
        <p>No sessions found</p>
      ) : (
        <div className="sessions-grid">
          {sessions.map((session) => (
            <div key={session.session_id} className="session-card">
              <h4>{session.art_title}</h4>
              <p>{session.description}</p>
              <p>Status: <span className={`status-${session.status}`}>{session.status}</span></p>
              <p>Photos: {session.uploaded_photos.length}</p>
              <button onClick={() => window.location.href = `/session/${session.session_id}`}>
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

### 11. update_session_status

**Type**: Update Function  
**Signature**: `update_session_status(session_id: string, status: string) -> { Ok: boolean } | { Err: string }`

```typescript
// Frontend Service
export const updateSessionStatus = async (sessionId: string, status: string): Promise<boolean> => {
  try {
    const result = await backend.update_session_status(sessionId, status);
    if ('Ok' in result) {
      return result.Ok;
    } else {
      throw new Error(result.Err);
    }
  } catch (error) {
    console.error("Failed to update session status:", error);
    throw error;
  }
};

// React Component Usage
const SessionStatusComponent = ({ sessionId, currentStatus }: { sessionId: string, currentStatus: string }) => {
  const [status, setStatus] = useState(currentStatus);
  const [updating, setUpdating] = useState(false);

  const statusOptions = [
    { value: "draft", label: "Draft" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "archived", label: "Archived" }
  ];

  const handleStatusUpdate = async (newStatus: string) => {
    setUpdating(true);
    try {
      await updateSessionStatus(sessionId, newStatus);
      setStatus(newStatus);
      console.log("Status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div>
      <h4>Session Status</h4>
      <div className="status-buttons">
        {statusOptions.map((option) => (
          <button
            key={option.value}
            className={`status-btn ${status === option.value ? 'active' : ''}`}
            onClick={() => handleStatusUpdate(option.value)}
            disabled={updating || status === option.value}
          >
            {option.label}
          </button>
        ))}
      </div>
      {updating && <p>Updating status...</p>}
    </div>
  );
};
```

### 12. remove_photo_from_session

**Type**: Update Function  
**Signature**: `remove_photo_from_session(session_id: string, photo_url: string) -> { Ok: boolean } | { Err: string }`

```typescript
// Frontend Service
export const removePhotoFromSession = async (sessionId: string, photoUrl: string): Promise<boolean> => {
  try {
    const result = await backend.remove_photo_from_session(sessionId, photoUrl);
    if ('Ok' in result) {
      return result.Ok;
    } else {
      throw new Error(result.Err);
    }
  } catch (error) {
    console.error("Failed to remove photo:", error);
    throw error;
  }
};

// React Component Usage
const PhotoGalleryComponent = ({ sessionId, photos }: { sessionId: string, photos: string[] }) => {
  const [currentPhotos, setCurrentPhotos] = useState(photos);
  const [removing, setRemoving] = useState<string | null>(null);

  const handleRemovePhoto = async (photoUrl: string) => {
    if (!confirm("Are you sure you want to remove this photo?")) return;

    setRemoving(photoUrl);
    try {
      await removePhotoFromSession(sessionId, photoUrl);
      setCurrentPhotos(currentPhotos.filter(url => url !== photoUrl));
      console.log("Photo removed successfully");
    } catch (error) {
      console.error("Error removing photo:", error);
      alert("Failed to remove photo");
    } finally {
      setRemoving(null);
    }
  };

  return (
    <div className="photo-gallery">
      {currentPhotos.map((photoUrl, index) => (
        <div key={index} className="photo-item">
          <img src={photoUrl} alt={`Photo ${index + 1}`} />
          <button
            className="remove-btn"
            onClick={() => handleRemovePhoto(photoUrl)}
            disabled={removing === photoUrl}
          >
            {removing === photoUrl ? "Removing..." : "Remove"}
          </button>
        </div>
      ))}
    </div>
  );
};
```

## S3 Configuration Functions

### 13. configure_s3

**Type**: Update Function  
**Signature**: `configure_s3(config: S3Config) -> boolean`

```typescript
// Frontend Service
export const configureS3 = async (config: S3Config): Promise<boolean> => {
  try {
    const result = await backend.configure_s3(config);
    return result;
  } catch (error) {
    console.error("Failed to configure S3:", error);
    throw error;
  }
};

// React Component Usage (Admin only)
const S3ConfigComponent = () => {
  const [config, setConfig] = useState<S3Config>({
    bucket_name: "",
    region: "",
    access_key_id: "",
    secret_access_key: "",
    endpoint: []
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const success = await configureS3(config);
      if (success) {
        alert("S3 configuration saved successfully");
      } else {
        alert("Failed to save S3 configuration");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error saving configuration");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="s3-config-form">
      <h3>S3 Configuration</h3>

      <div>
        <label>Bucket Name:</label>
        <input
          value={config.bucket_name}
          onChange={(e) => setConfig({...config, bucket_name: e.target.value})}
          required
        />
      </div>

      <div>
        <label>Region:</label>
        <input
          value={config.region}
          onChange={(e) => setConfig({...config, region: e.target.value})}
          required
        />
      </div>

      <div>
        <label>Access Key ID:</label>
        <input
          value={config.access_key_id}
          onChange={(e) => setConfig({...config, access_key_id: e.target.value})}
          required
        />
      </div>

      <div>
        <label>Secret Access Key:</label>
        <input
          type="password"
          value={config.secret_access_key}
          onChange={(e) => setConfig({...config, secret_access_key: e.target.value})}
          required
        />
      </div>

      <div>
        <label>Custom Endpoint (optional):</label>
        <input
          value={config.endpoint[0] || ""}
          onChange={(e) => setConfig({
            ...config,
            endpoint: e.target.value ? [e.target.value] : []
          })}
          placeholder="https://s3.amazonaws.com"
        />
      </div>

      <button type="submit" disabled={saving}>
        {saving ? "Saving..." : "Save Configuration"}
      </button>
    </form>
  );
};
```

### 14. get_s3_config_status

**Type**: Query Function  
**Signature**: `get_s3_config_status() -> boolean`

```typescript
// Frontend Service
export const getS3ConfigStatus = async (): Promise<boolean> => {
  try {
    const status = await backend.get_s3_config_status();
    return status;
  } catch (error) {
    console.error("Failed to check S3 config status:", error);
    throw error;
  }
};

// React Component Usage
const S3StatusComponent = () => {
  const [isConfigured, setIsConfigured] = useState<boolean>(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const status = await getS3ConfigStatus();
        setIsConfigured(status);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setChecking(false);
      }
    };

    checkStatus();
  }, []);

  if (checking) return <div>Checking S3 status...</div>;

  return (
    <div className={`status-indicator ${isConfigured ? 'configured' : 'not-configured'}`}>
      <h4>S3 Storage Status</h4>
      <p>
        Status: <strong>{isConfigured ? "Configured" : "Not Configured"}</strong>
      </p>
      {!isConfigured && (
        <p className="warning">
          S3 storage is not configured. File uploads will not work.
        </p>
      )}
    </div>
  );
};
```

## ICRC-7 NFT Functions

### 15. icrc7_collection_metadata

**Type**: Query Function  
**Signature**: `icrc7_collection_metadata() -> CollectionMetadata`

```typescript
// Frontend Service
export const getCollectionMetadata = async (): Promise<CollectionMetadata> => {
  try {
    const metadata = await backend.icrc7_collection_metadata();
    return metadata;
  } catch (error) {
    console.error("Failed to fetch collection metadata:", error);
    throw error;
  }
};

// React Component Usage
const CollectionInfoComponent = () => {
  const [metadata, setMetadata] = useState<CollectionMetadata | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const collectionData = await getCollectionMetadata();
        setMetadata(collectionData);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, []);

  if (loading) return <div>Loading collection info...</div>;
  if (!metadata) return <div>Collection data not available</div>;

  return (
    <div className="collection-info">
      <h2>{metadata.name}</h2>
      {metadata.description && <p>{metadata.description}</p>}
      {metadata.image && <img src={metadata.image} alt="Collection" />}
      <div className="stats">
        <p>Total Supply: {Number(metadata.total_supply)}</p>
        {metadata.max_supply && <p>Max Supply: {Number(metadata.max_supply)}</p>}
      </div>
    </div>
  );
};
```

### 16. icrc7_total_supply

**Type**: Query Function  
**Signature**: `icrc7_total_supply() -> bigint`

```typescript
// Frontend Service
export const getTotalSupply = async (): Promise<number> => {
  try {
    const supply = await backend.icrc7_total_supply();
    return Number(supply);
  } catch (error) {
    console.error("Failed to fetch total supply:", error);
    throw error;
  }
};

// React Component Usage
const NFTStatsComponent = () => {
  const [totalSupply, setTotalSupply] = useState<number>(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const supply = await getTotalSupply();
        setTotalSupply(supply);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="nft-stats">
      <h3>NFT Collection Stats</h3>
      <p>Total NFTs Minted: <strong>{totalSupply}</strong></p>
    </div>
  );
};
```

### 17. icrc7_tokens

**Type**: Query Function  
**Signature**: `icrc7_tokens(prev: bigint | undefined, take: bigint | undefined) -> bigint[]`

```typescript
// Frontend Service
export const getTokens = async (prev?: bigint, take?: bigint): Promise<bigint[]> => {
  try {
    const tokens = await backend.icrc7_tokens(
      prev ? [prev] : [],
      take ? [take] : []
    );
    return tokens;
  } catch (error) {
    console.error("Failed to fetch tokens:", error);
    throw error;
  }
};

// React Component Usage
const TokenListComponent = () => {
  const [tokens, setTokens] = useState<bigint[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const fetchTokens = async (pageNum: number) => {
    setLoading(true);
    try {
      const prev = pageNum > 0 ? tokens[tokens.length - 1] : undefined;
      const newTokens = await getTokens(prev, BigInt(pageSize));

      if (pageNum === 0) {
        setTokens(newTokens);
      } else {
        setTokens(prev => [...prev, ...newTokens]);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokens(0);
  }, []);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchTokens(nextPage);
  };

  return (
    <div>
      <h3>All NFT Tokens</h3>
      <div className="token-grid">
        {tokens.map((tokenId) => (
          <TokenCard key={tokenId.toString()} tokenId={Number(tokenId)} />
        ))}
      </div>

      {!loading && (
        <button onClick={loadMore}>Load More</button>
      )}

      {loading && <div>Loading tokens...</div>}
    </div>
  );
};
```

### 18. icrc7_balance_of

**Type**: Query Function  
**Signature**: `icrc7_balance_of(accounts: Account[]) -> bigint[]`

```typescript
// Frontend Service
export const getBalanceOf = async (accounts: Account[]): Promise<bigint[]> => {
  try {
    const balances = await backend.icrc7_balance_of(accounts);
    return balances;
  } catch (error) {
    console.error("Failed to fetch balances:", error);
    throw error;
  }
};

// React Component Usage with Principal
const UserNFTBalanceComponent = ({ principalId }: { principalId: string }) => {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const account: Account = {
          owner: Principal.fromText(principalId),
          subaccount: []
        };

        const balances = await getBalanceOf([account]);
        setBalance(Number(balances[0] || 0));
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [principalId]);

  if (loading) return <div>Loading balance...</div>;

  return (
    <div className="nft-balance">
      <p>NFTs Owned: <strong>{balance}</strong></p>
    </div>
  );
};
```

### 19. mint_nft_from_session

**Type**: Update Function  
**Signature**: `mint_nft_from_session(session_id: string, recipient: Account, additional_attributes: [string, string][]) -> { Ok: bigint } | { Err: string }`

```typescript
// Frontend Service
export const mintNFTFromSession = async (
  sessionId: string,
  recipient: Account,
  additionalAttributes: [string, string][] = []
): Promise<bigint> => {
  try {
    const result = await backend.mint_nft_from_session(sessionId, recipient, additionalAttributes);
    if ('Ok' in result) {
      return result.Ok;
    } else {
      throw new Error(result.Err);
    }
  } catch (error) {
    console.error("Failed to mint NFT:", error);
    throw error;
  }
};

// React Component Usage
const MintNFTComponent = ({ sessionId }: { sessionId: string }) => {
  const [recipientPrincipal, setRecipientPrincipal] = useState("");
  const [customAttributes, setCustomAttributes] = useState<[string, string][]>([]);
  const [minting, setMinting] = useState(false);
  const [mintedTokenId, setMintedTokenId] = useState<bigint | null>(null);

  const addAttribute = () => {
    setCustomAttributes([...customAttributes, ["", ""]]);
  };

  const updateAttribute = (index: number, key: string, value: string) => {
    const updated = [...customAttributes];
    updated[index] = [key, value];
    setCustomAttributes(updated);
  };

  const handleMint = async () => {
    if (!recipientPrincipal) {
      alert("Please enter recipient principal");
      return;
    }

    setMinting(true);
    try {
      const recipient: Account = {
        owner: Principal.fromText(recipientPrincipal),
        subaccount: []
      };

      const validAttributes = customAttributes.filter(([k, v]) => k && v);

      const tokenId = await mintNFTFromSession(sessionId, recipient, validAttributes);
      setMintedTokenId(tokenId);
      console.log("NFT minted successfully:", tokenId);
    } catch (error) {
      console.error("Minting error:", error);
      alert("Failed to mint NFT");
    } finally {
      setMinting(false);
    }
  };

  return (
    <div className="mint-nft-form">
      <h3>Mint NFT from Session</h3>

      <div>
        <label>Recipient Principal:</label>
        <input
          value={recipientPrincipal}
          onChange={(e) => setRecipientPrincipal(e.target.value)}
          placeholder="principal-id-here"
          required
        />
      </div>

      <div>
        <h4>Custom Attributes</h4>
        {customAttributes.map(([key, value], index) => (
          <div key={index} className="attribute-row">
            <input
              placeholder="Attribute name"
              value={key}
              onChange={(e) => updateAttribute(index, e.target.value, value)}
            />
            <input
              placeholder="Attribute value"
              value={value}
              onChange={(e) => updateAttribute(index, key, e.target.value)}
            />
          </div>
        ))}
        <button type="button" onClick={addAttribute}>Add Attribute</button>
      </div>

      <button onClick={handleMint} disabled={minting}>
        {minting ? "Minting..." : "Mint NFT"}
      </button>

      {mintedTokenId && (
        <div className="success-message">
          <p>NFT minted successfully!</p>
          <p>Token ID: <strong>{mintedTokenId.toString()}</strong></p>
        </div>
      )}
    </div>
  );
};
```

### 20. get_user_nfts

**Type**: Query Function  
**Signature**: `get_user_nfts(owner: Principal) -> Token[]`

```typescript
// Frontend Service
export const getUserNFTs = async (owner: Principal): Promise<Token[]> => {
  try {
    const tokens = await backend.get_user_nfts(owner);
    return tokens;
  } catch (error) {
    console.error("Failed to fetch user NFTs:", error);
    throw error;
  }
};

// React Component Usage
const UserNFTsComponent = ({ principalId }: { principalId: string }) => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserNFTs = async () => {
      try {
        const owner = Principal.fromText(principalId);
        const userTokens = await getUserNFTs(owner);
        setTokens(userTokens);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserNFTs();
  }, [principalId]);

  if (loading) return <div>Loading your NFTs...</div>;

  return (
    <div className="user-nfts">
      <h3>My NFT Collection ({tokens.length})</h3>
      {tokens.length === 0 ? (
        <p>You don't own any NFTs yet.</p>
      ) : (
        <div className="nft-grid">
          {tokens.map((token) => (
            <div key={token.id.toString()} className="nft-card">
              <h4>{token.metadata.name}</h4>
              {token.metadata.image && (
                <img src={token.metadata.image} alt={token.metadata.name} />
              )}
              {token.metadata.description && (
                <p>{token.metadata.description}</p>
              )}
              <div className="token-attributes">
                {token.metadata.attributes.map(([key, value], index) => (
                  <span key={index} className="attribute">
                    <strong>{key}:</strong> {value}
                  </span>
                ))}
              </div>
              <p className="token-id">Token ID: {token.id.toString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

## Complete Integration Example

Berikut adalah contoh komponen lengkap yang mengintegrasikan beberapa fungsi API:

```typescript
// hooks/useOriginStampAPI.ts
import { useState, useEffect } from 'react';
import { backend } from '../../declarations/backend';
import type { PhysicalArtSession, Token } from '../../declarations/backend/backend.did.d.ts';

export const useOriginStampAPI = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
    }
  }, []);

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const result = await backend.login(username, password);
      if (result.success) {
        setCurrentUser(username);
        setIsLoggedIn(true);
        localStorage.setItem('currentUser', username);
        return { success: true, message: result.message };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      return { success: false, message: 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('currentUser');
  };

  const createSession = async (artTitle: string, description: string) => {
    if (!currentUser) throw new Error('Not logged in');

    setLoading(true);
    try {
      const result = await backend.create_physical_art_session(currentUser, artTitle, description);
      if ('Ok' in result) {
        return result.Ok;
      } else {
        throw new Error(result.Err);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    isLoggedIn,
    currentUser,
    loading,
    login,
    logout,
    createSession
  };
};

// components/OriginStampApp.tsx
const OriginStampApp = () => {
  const { isLoggedIn, currentUser, login, logout } = useOriginStampAPI();
  const [activeTab, setActiveTab] = useState('sessions');

  if (!isLoggedIn) {
    return <LoginComponent onLogin={login} />;
  }

  return (
    <div className="app">
      <header>
        <h1>Origin Stamp ICP</h1>
        <div className="user-info">
          <span>Welcome, {currentUser}</span>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      <nav className="tabs">
        <button
          className={activeTab === 'sessions' ? 'active' : ''}
          onClick={() => setActiveTab('sessions')}
        >
          Art Sessions
        </button>
        <button
          className={activeTab === 'nfts' ? 'active' : ''}
          onClick={() => setActiveTab('nfts')}
        >
          My NFTs
        </button>
        <button
          className={activeTab === 'create' ? 'active' : ''}
          onClick={() => setActiveTab('create')}
        >
          Create Session
        </button>
      </nav>

      <main>
        {activeTab === 'sessions' && <UserSessionsComponent username={currentUser!} />}
        {activeTab === 'nfts' && <UserNFTsComponent principalId={currentUser!} />}
        {activeTab === 'create' && <CreateSessionComponent />}
      </main>
    </div>
  );
};
```

## Error Handling Best Practices

```typescript
// utils/errorHandler.ts
export const handleAPIError = (error: any, context: string) => {
  console.error(`${context} error:`, error);

  if (error.message?.includes("Unauthorized")) {
    // Handle authentication errors
    localStorage.removeItem("currentUser");
    window.location.href = "/login";
    return "Please login again";
  }

  if (error.message?.includes("Network")) {
    return "Network error. Please check your connection.";
  }

  return error.message || "An unexpected error occurred";
};

// Usage in components
const handleOperation = async () => {
  try {
    setLoading(true);
    await someAPICall();
  } catch (error) {
    const message = handleAPIError(error, "Operation");
    setError(message);
  } finally {
    setLoading(false);
  }
};
```

## Type Definitions

Pastikan untuk menggunakan type definitions yang tepat:

```typescript
// types/api.ts
import type {
  LoginResult,
  PhysicalArtSession,
  UploadFileData,
  S3Config,
  Account,
  Token,
  TokenMetadata,
  TransferRequest,
  TransferResponse,
  CollectionMetadata,
} from "../declarations/backend/backend.did.d.ts";

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface SessionFormData {
  artTitle: string;
  description: string;
}

export interface NFTMintData {
  sessionId: string;
  recipientPrincipal: string;
  customAttributes: [string, string][];
}
```

Dokumentasi ini mencakup semua fungsi API yang tersedia di backend canister Origin Stamp ICP dan contoh implementasi frontend yang komprehensif. Setiap fungsi dilengkapi dengan service layer, React component usage, dan best practices untuk error handling.
