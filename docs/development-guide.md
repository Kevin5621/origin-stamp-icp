# Development Guide

## Overview

Panduan development lengkap untuk berkontribusi pada Origin Stamp ICP, meliputi coding standards, testing strategy, dan best practices.

> **Quick Setup**: Untuk setup development environment cepat, lihat [`development-setup.md`](./development/development-setup.md)

## Coding Standards

### Rust Backend

#### Code Style

```rust
// Use descriptive function names
#[ic_cdk::update]
fn create_physical_art_session(
    username: String,
    art_title: String,
    description: String,
) -> Result<String, String> {
    // Validate inputs
    if username.is_empty() || art_title.is_empty() {
        return Err("Username and title cannot be empty".to_string());
    }

    // Implementation
    let session = PhysicalArtSession {
        session_id: generate_random_id(),
        username: username.clone(),
        art_title,
        description,
        uploaded_photos: Vec::new(),
        status: "draft".to_string(),
        created_at: ic_cdk::api::time(),
        updated_at: ic_cdk::api::time(),
    };

    // Store and return
    PHYSICAL_ART_SESSIONS.with(|sessions| {
        sessions.borrow_mut().insert(session.session_id.clone(), session);
    });

    Ok(session.session_id)
}
```

#### Error Handling

```rust
// Use Result types for error handling
type SessionResult<T> = Result<T, String>;

// Provide meaningful error messages
fn validate_session_id(session_id: &str) -> SessionResult<()> {
    if session_id.is_empty() {
        return Err("Session ID cannot be empty".to_string());
    }

    if session_id.len() < 5 {
        return Err("Session ID too short".to_string());
    }

    Ok(())
}
```

#### Documentation

````rust
/// Creates a new physical art session for a user
///
/// # Arguments
/// * `username` - The username of the session owner
/// * `art_title` - Title of the artwork
/// * `description` - Description of the artwork
///
/// # Returns
/// * `Ok(session_id)` - The unique session identifier
/// * `Err(message)` - Error message if creation failed
///
/// # Example
/// ```
/// let session_id = create_physical_art_session(
///     "artist1".to_string(),
///     "My Painting".to_string(),
///     "Oil on canvas".to_string()
/// )?;
/// ```
#[ic_cdk::update]
fn create_physical_art_session(
    username: String,
    art_title: String,
    description: String,
) -> Result<String, String> {
    // Implementation
}
````

### TypeScript Frontend

#### Component Structure

```typescript
// components/PhysicalArtSetup.tsx
import React, { useState, useEffect } from 'react';
import { PhysicalArtService } from '../services/physicalArtService';
import type { PhysicalArtSession } from '../../declarations/backend/backend.did';

interface PhysicalArtSetupProps {
  username: string;
  onSessionCreated?: (sessionId: string) => void;
}

const PhysicalArtSetup: React.FC<PhysicalArtSetupProps> = ({
  username,
  onSessionCreated
}) => {
  const [artTitle, setArtTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const sessionId = await PhysicalArtService.createSession(
        username,
        artTitle,
        description
      );

      onSessionCreated?.(sessionId);

      // Reset form
      setArtTitle('');
      setDescription('');

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="physical-art-setup">
      <h2>Create Physical Art Session</h2>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="artTitle">Art Title</label>
          <input
            id="artTitle"
            type="text"
            value={artTitle}
            onChange={(e) => setArtTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Session'}
        </button>
      </form>
    </div>
  );
};

export default PhysicalArtSetup;
```

#### Service Layer Pattern

```typescript
// services/physicalArtService.ts
import { backend } from "../../declarations/backend";
import type {
  PhysicalArtSession,
  UploadFileData,
  Result_1,
} from "../../declarations/backend/backend.did";

export class PhysicalArtService {
  /**
   * Creates a new physical art session
   */
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

  /**
   * Generates upload URL for file
   */
  static async generateUploadUrl(
    sessionId: string,
    filename: string,
    contentType: string,
  ): Promise<string> {
    try {
      const uploadFileData: UploadFileData = {
        filename,
        content_type: contentType,
        file_size: BigInt(0), // Will be set during upload
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
}
```

#### Error Handling

```typescript
// utils/errorHandling.ts
export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleBackendError = (error: any): AppError => {
  if (typeof error === 'string') {
    return new AppError(error);
  }

  if (error instanceof Error) {
    return new AppError(error.message, 'BACKEND_ERROR', error);
  }

  return new AppError('Unknown backend error', 'UNKNOWN_ERROR', error);
};

// Usage in components
try {
  const result = await PhysicalArtService.createSession(...);
} catch (error) {
  const appError = handleBackendError(error);
  setError(appError.message);
}
```

## Development Workflow

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-functionality

# Make changes and commit
git add .
git commit -m "feat: add new functionality"

# Push and create PR
git push origin feature/new-functionality
```

### Commit Message Convention

```
feat: add new feature
fix: fix bug
docs: update documentation
style: formatting changes
refactor: code refactoring
test: add tests
chore: maintenance tasks
```

### Development Commands

```bash
# Start development environment
npm run dev

# Run tests
npm test

# Format code
npm run format

# Lint code
npm run lint

# Build for production
npm run build

# Deploy locally
npm run deploy

# Deploy with S3 setup
npm run deploy:with-s3
```

## Testing Strategy

### Backend Testing

```rust
// tests/backend_tests.rs
#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_create_session() {
        let session_id = create_physical_art_session(
            "test_user".to_string(),
            "Test Art".to_string(),
            "Test description".to_string(),
        );

        assert!(session_id.is_ok());

        let session = get_session_details(session_id.unwrap());
        assert!(session.is_some());
    }

    #[tokio::test]
    async fn test_invalid_session_creation() {
        let result = create_physical_art_session(
            "".to_string(),  // Empty username
            "Test Art".to_string(),
            "Test description".to_string(),
        );

        assert!(result.is_err());
    }
}
```

### Frontend Testing

```typescript
// tests/components/PhysicalArtSetup.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PhysicalArtSetup from '../components/PhysicalArtSetup';
import { PhysicalArtService } from '../services/physicalArtService';

// Mock service
jest.mock('../services/physicalArtService');
const mockPhysicalArtService = PhysicalArtService as jest.Mocked<typeof PhysicalArtService>;

describe('PhysicalArtSetup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('creates session successfully', async () => {
    mockPhysicalArtService.createSession.mockResolvedValue('session-123');

    render(<PhysicalArtSetup username="testuser" />);

    fireEvent.change(screen.getByLabelText('Art Title'), {
      target: { value: 'Test Art' }
    });

    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'Test Description' }
    });

    fireEvent.click(screen.getByText('Create Session'));

    await waitFor(() => {
      expect(mockPhysicalArtService.createSession).toHaveBeenCalledWith(
        'testuser',
        'Test Art',
        'Test Description'
      );
    });
  });

  test('handles creation error', async () => {
    mockPhysicalArtService.createSession.mockRejectedValue(
      new Error('Creation failed')
    );

    render(<PhysicalArtSetup username="testuser" />);

    fireEvent.change(screen.getByLabelText('Art Title'), {
      target: { value: 'Test Art' }
    });

    fireEvent.click(screen.getByText('Create Session'));

    await waitFor(() => {
      expect(screen.getByText('Creation failed')).toBeInTheDocument();
    });
  });
});
```

### Integration Testing

```bash
#!/bin/bash
# test-integration.sh

echo "Running integration tests..."

# Start local DFX
dfx start --clean --background

# Deploy canisters
dfx deploy

# Run backend tests
echo "Testing backend..."
dfx canister call backend register_user '("testuser", "password123")'
dfx canister call backend create_physical_art_session '("testuser", "Test Art", "Description")'

# Test S3 configuration
echo "Testing S3 configuration..."
./scripts/setup-s3.sh

# Test upload flow
echo "Testing upload flow..."
./test-full-flow.sh

# Cleanup
dfx stop

echo "Integration tests completed!"
```

## Debugging

### Backend Debugging

```rust
// Add debug functions (only in development)
#[cfg(feature = "debug")]
#[ic_cdk::query]
fn debug_sessions() -> Vec<PhysicalArtSession> {
    PHYSICAL_ART_SESSIONS.with(|sessions| {
        sessions.borrow().values().cloned().collect()
    })
}

#[cfg(feature = "debug")]
#[ic_cdk::query]
fn debug_user_count() -> usize {
    USERS.with(|users| users.borrow().len())
}
```

### Frontend Debugging

```typescript
// utils/debug.ts
export const debug = {
  log: (message: string, data?: any) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`[DEBUG] ${message}`, data);
    }
  },

  error: (message: string, error?: any) => {
    if (process.env.NODE_ENV === "development") {
      console.error(`[ERROR] ${message}`, error);
    }
  },

  backend: {
    logCall: (method: string, params?: any) => {
      debug.log(`Backend call: ${method}`, params);
    },

    logResponse: (method: string, response?: any) => {
      debug.log(`Backend response: ${method}`, response);
    },
  },
};

// Usage in services
export class PhysicalArtService {
  static async createSession(
    username: string,
    artTitle: string,
    description: string,
  ) {
    debug.backend.logCall("create_physical_art_session", {
      username,
      artTitle,
      description,
    });

    try {
      const result = await backend.create_physical_art_session(
        username,
        artTitle,
        description,
      );
      debug.backend.logResponse("create_physical_art_session", result);
      return result;
    } catch (error) {
      debug.error("Failed to create session", error);
      throw error;
    }
  }
}
```

## Performance Guidelines

### Backend Performance

```rust
// Use efficient data structures
use std::collections::HashMap;

// Minimize allocations in hot paths
fn process_session_list(sessions: &[PhysicalArtSession]) -> Vec<String> {
    sessions.iter().map(|s| s.session_id.clone()).collect()
}

// Use batch operations when possible
#[ic_cdk::update]
fn batch_update_session_status(updates: Vec<(String, String)>) -> Vec<Result<bool, String>> {
    updates.into_iter().map(|(id, status)| {
        update_session_status(id, status)
    }).collect()
}
```

### Frontend Performance

```typescript
// Use React.memo for expensive components
const PhysicalArtSetup = React.memo<PhysicalArtSetupProps>(({ username }) => {
  // Component implementation
});

// Optimize re-renders with useMemo and useCallback
const SessionList: React.FC<SessionListProps> = ({ sessions }) => {
  const sortedSessions = useMemo(() => {
    return sessions.sort((a, b) => b.created_at - a.created_at);
  }, [sessions]);

  const handleSessionClick = useCallback((sessionId: string) => {
    // Handle click
  }, []);

  return (
    <div>
      {sortedSessions.map(session => (
        <SessionCard
          key={session.session_id}
          session={session}
          onClick={handleSessionClick}
        />
      ))}
    </div>
  );
};

// Lazy load components
const AdminPage = React.lazy(() => import('./components/admin/AdminPage'));
```

## Security Best Practices

### Input Validation

```rust
// Backend validation
fn validate_username(username: &str) -> Result<(), String> {
    if username.is_empty() {
        return Err("Username cannot be empty".to_string());
    }

    if username.len() > 50 {
        return Err("Username too long".to_string());
    }

    if !username.chars().all(|c| c.is_alphanumeric() || c == '_') {
        return Err("Username contains invalid characters".to_string());
    }

    Ok(())
}
```

```typescript
// Frontend validation
export const validateInput = {
  username: (username: string): string | null => {
    if (!username || username.trim().length === 0) {
      return "Username is required";
    }

    if (username.length > 50) {
      return "Username too long";
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return "Username can only contain letters, numbers, and underscores";
    }

    return null;
  },

  artTitle: (title: string): string | null => {
    if (!title || title.trim().length === 0) {
      return "Art title is required";
    }

    if (title.length > 200) {
      return "Title too long";
    }

    return null;
  },
};
```

### Authentication

```rust
// Simple principal-based authentication
fn get_caller() -> Principal {
    ic_cdk::caller()
}

fn require_authenticated() -> Result<Principal, String> {
    let caller = get_caller();
    if caller == Principal::anonymous() {
        return Err("Authentication required".to_string());
    }
    Ok(caller)
}

#[ic_cdk::update]
fn create_physical_art_session_authenticated(
    art_title: String,
    description: String,
) -> Result<String, String> {
    let caller = require_authenticated()?;
    let username = caller.to_string(); // Use principal as username

    create_physical_art_session(username, art_title, description)
}
```

## Documentation Standards

### Code Documentation

````rust
/// Manages physical art sessions and photo uploads
///
/// This module provides functionality for creating, managing, and tracking
/// physical art sessions. Each session represents a single artwork with
/// associated metadata and uploaded photos.
///
/// # Example
/// ```rust
/// // Create a new session
/// let session_id = create_physical_art_session(
///     "artist1".to_string(),
///     "My Painting".to_string(),
///     "Oil on canvas artwork".to_string()
/// )?;
///
/// // Generate upload URL
/// let upload_url = generate_upload_url(session_id, file_data)?;
/// ```
pub mod physical_art_sessions {
    // Module implementation
}
````

### README Updates

```markdown
# Feature: Physical Art Sessions

## Overview

Brief description of the feature and its purpose.

## Usage

Code examples showing how to use the feature.

## API Reference

Links to detailed API documentation.

## Testing

How to run tests for this feature.
```

## Contributing Guidelines

### Pull Request Process

1. Create feature branch from `main`
2. Implement feature with tests
3. Update documentation
4. Run test suite
5. Create pull request with description
6. Address review feedback
7. Merge after approval

### Code Review Checklist

- [ ] Code follows project style guidelines
- [ ] All tests pass
- [ ] Documentation updated
- [ ] No security vulnerabilities
- [ ] Performance considerations addressed
- [ ] Error handling implemented
- [ ] Input validation added

### Release Process

```bash
# Update version
npm version patch  # or minor, major

# Update changelog
# Edit CHANGELOG.md

# Create release tag
git tag -a v1.0.1 -m "Release v1.0.1"
git push origin v1.0.1

# Deploy to production
npm run deploy:production
```

## Troubleshooting Common Issues

### Development Environment

```bash
# Clear DFX state
dfx stop
rm -rf .dfx
dfx start --clean

# Clear node modules
rm -rf node_modules package-lock.json
npm install

# Clear Rust cache
cargo clean
```

### Build Issues

```bash
# Rust target missing
rustup target add wasm32-unknown-unknown

# DFX version mismatch
dfx upgrade

# Node version issues
nvm use 18
```

### Runtime Issues

```bash
# Check canister logs
dfx canister logs backend

# Check canister status
dfx canister status backend
dfx canister status frontend

# Restart canisters
dfx canister stop backend
dfx canister start backend
```
