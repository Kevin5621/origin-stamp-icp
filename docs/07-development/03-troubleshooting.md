# 🔧 Troubleshooting Guide

## Overview

This guide provides solutions for common issues encountered during development of OriginStamp ICP, including setup problems, build errors, deployment issues, and runtime debugging.

## 🚨 Common Issues & Solutions

### 1. **Development Environment Setup**

#### Issue: DFX Installation Problems

```bash
# Error: dfx command not found
# Solution: Install DFX properly
sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"

# Verify installation
dfx --version
```

#### Issue: Node.js Version Conflicts

```bash
# Error: Unsupported Node.js version
# Solution: Use Node.js 18+
nvm install 18
nvm use 18

# Verify version
node --version
npm --version
```

#### Issue: Rust Toolchain Issues

```bash
# Error: Rust not found
# Solution: Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Add to PATH
source ~/.cargo/env

# Verify installation
rustc --version
cargo --version
```

### 2. **Frontend Development Issues**

#### Issue: Build Failures

```bash
# Error: Module not found
# Solution: Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# Alternative: Use yarn
yarn cache clean
yarn install
```

#### Issue: TypeScript Compilation Errors

```typescript
// Error: Cannot find module
// Solution: Check tsconfig.json paths
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"],
      "@/utils/*": ["src/utils/*"]
    }
  }
}

// Rebuild TypeScript
npm run build:check
```

#### Issue: CSS/SCSS Compilation

```bash
# Error: SCSS import not found
# Solution: Check import paths in main.scss
@import "settings/settings";
@import "tools/mixins";
@import "generic/base";
@import "elements/forms";
@import "objects/layout";
@import "components/buttons";
@import "utilities/utilities";

# Rebuild CSS
npm run build:css
```

#### Issue: React Component Errors

```typescript
// Error: Hook called conditionally
// Solution: Always call hooks at top level
function MyComponent({ condition }: { condition: boolean }) {
  // ❌ Wrong
  if (condition) {
    const [state, setState] = useState(false);
  }

  // ✅ Correct
  const [state, setState] = useState(false);

  if (condition) {
    // Use state here
  }
}

// Error: Missing dependencies in useEffect
// Solution: Include all dependencies
useEffect(() => {
  fetchData(userId, token);
}, [userId, token]); // Include all dependencies
```

### 3. **Backend Development Issues**

#### Issue: Cargo Build Errors

```bash
# Error: Dependency resolution failed
# Solution: Update dependencies
cargo update
cargo clean
cargo build

# Check for outdated packages
cargo outdated
```

#### Issue: Canister Deployment Failures

```bash
# Error: Canister not found
# Solution: Check canister status
dfx canister status backend
dfx canister status frontend

# Redeploy if needed
dfx deploy --all

# Check logs
dfx canister call backend get_logs
```

#### Issue: Memory Management Errors

```rust
// Error: Out of memory
// Solution: Optimize memory usage
use std::collections::HashMap;
use std::cell::RefCell;

thread_local! {
    static USERS: RefCell<HashMap<String, User>> = RefCell::new(HashMap::new());
}

// Use efficient data structures
let mut users = HashMap::with_capacity(expected_size);
```

#### Issue: Candid Interface Errors

```candid
// Error: Type mismatch in Candid
// Solution: Ensure type consistency
type User = record {
    id: text;
    username: text;
    email: opt text;
    created_at: nat64;
};

service : {
    "get_user": (text) -> (opt User) query;
    "create_user": (User) -> (Result);
};
```

### 4. **Integration Issues**

#### Issue: Frontend-Backend Communication

```typescript
// Error: CORS issues
// Solution: Configure CORS in backend
#[ic_cdk::query]
fn get_user(id: String) -> Option<User> {
    // Add CORS headers
    ic_cdk::api::call::call_with_payment(
        &ic_cdk::export::Principal::from_text("").unwrap(),
        "http_request",
        (),
        0,
    );
}

// Frontend: Handle CORS
const response = await fetch('/api/user', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
});
```

#### Issue: S3 Integration Problems

```typescript
// Error: S3 upload failed
// Solution: Check credentials and configuration
const s3Config = {
  endpoint: process.env.S3_ENDPOINT,
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
  region: process.env.S3_REGION,
};

// Verify environment variables
console.log("S3 Config:", {
  endpoint: s3Config.endpoint,
  region: s3Config.region,
  hasAccessKey: !!s3Config.accessKeyId,
});
```

#### Issue: Google OAuth Issues

```typescript
// Error: OAuth redirect failed
// Solution: Check OAuth configuration
const googleConfig = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  redirectUri: process.env.GOOGLE_REDIRECT_URI,
  scope: "email profile",
};

// Verify redirect URI matches Google Console
console.log("OAuth Config:", {
  clientId: googleConfig.clientId,
  redirectUri: googleConfig.redirectUri,
});
```

### 5. **Testing Issues**

#### Issue: Test Environment Setup

```bash
# Error: Test database not found
# Solution: Setup test environment
export NODE_ENV=test
export TEST_DATABASE_URL=postgresql://test:test@localhost:5432/test_db

# Run tests with proper environment
npm run test:setup
npm run test
```

#### Issue: Mock Data Problems

```typescript
// Error: Mock not working
// Solution: Properly setup mocks
import { mockSessions } from "../fixtures/sessions";

jest.mock("../services/sessionService", () => ({
  getSessions: jest.fn().mockResolvedValue(mockSessions),
  createSession: jest.fn().mockResolvedValue({ id: "new-session" }),
}));

// Clear mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
});
```

#### Issue: E2E Test Failures

```typescript
// Error: Element not found
// Solution: Add proper selectors and waits
test("user can create session", async ({ page }) => {
  await page.goto("/dashboard");

  // Wait for page to load
  await page.waitForLoadState("networkidle");

  // Use data-testid for reliable selection
  await page.click('[data-testid="create-session-button"]');

  // Wait for modal to appear
  await page.waitForSelector('[data-testid="session-modal"]');

  // Fill form
  await page.fill('[data-testid="title-input"]', "Test Session");
  await page.click('[data-testid="submit-button"]');

  // Wait for success
  await page.waitForSelector('[data-testid="success-message"]');
});
```

### 6. **Performance Issues**

#### Issue: Slow Build Times

```bash
# Solution: Optimize build configuration
# vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['lodash', 'date-fns'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
});
```

#### Issue: Memory Leaks

```typescript
// Error: Memory usage growing
// Solution: Cleanup resources
useEffect(() => {
  const interval = setInterval(() => {
    // Do something
  }, 1000);

  return () => {
    clearInterval(interval);
  };
}, []);

// Cleanup event listeners
useEffect(() => {
  const handleResize = () => {
    // Handle resize
  };

  window.addEventListener("resize", handleResize);

  return () => {
    window.removeEventListener("resize", handleResize);
  };
}, []);
```

### 7. **Deployment Issues**

#### Issue: Production Build Failures

```bash
# Error: Build fails in production
# Solution: Check environment variables
# .env.production
VITE_API_URL=https://api.originstamp.ic0.app
VITE_S3_ENDPOINT=https://s3.amazonaws.com
VITE_GOOGLE_CLIENT_ID=your-client-id

# Verify build
npm run build
npm run preview
```

#### Issue: Canister Upgrade Failures

```bash
# Error: Canister upgrade failed
# Solution: Check canister status and upgrade
dfx canister status backend
dfx canister stop backend
dfx canister delete backend
dfx deploy backend

# Or use upgrade
dfx canister install backend --mode upgrade
```

#### Issue: Environment Configuration

```bash
# Error: Environment variables not loaded
# Solution: Check environment setup
# dfx.json
{
  "canisters": {
    "backend": {
      "env": {
        "S3_ENDPOINT": "https://s3.amazonaws.com",
        "S3_ACCESS_KEY": "your-access-key",
        "S3_SECRET_KEY": "your-secret-key"
      }
    }
  }
}
```

## 🔍 Debugging Techniques

### 1. **Frontend Debugging**

#### React DevTools

```typescript
// Install React DevTools
npm install -g react-devtools

// Start DevTools
react-devtools

// Use in components
console.log('Component state:', state);
console.log('Props:', props);
```

#### Network Debugging

```typescript
// Add request/response logging
const apiCall = async (url: string, options: RequestInit) => {
  console.log("Request:", { url, options });

  try {
    const response = await fetch(url, options);
    console.log("Response:", response);

    const data = await response.json();
    console.log("Data:", data);

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
```

### 2. **Backend Debugging**

#### Canister Logs

```rust
// Add logging to Rust code
use ic_cdk::println;

#[ic_cdk::update]
fn create_user(username: String, password: String) -> Result<User, String> {
    println!("Creating user: {}", username);

    // Your logic here

    println!("User created successfully: {}", username);
    Ok(user)
}

// View logs
dfx canister call backend get_logs
```

#### Error Handling

```rust
// Proper error handling
#[ic_cdk::update]
fn risky_operation() -> Result<String, String> {
    let result = some_operation().map_err(|e| {
        println!("Operation failed: {:?}", e);
        format!("Operation failed: {}", e)
    })?;

    Ok(result)
}
```

### 3. **Database Debugging**

#### Query Logging

```rust
// Log database operations
fn get_user_by_id(id: String) -> Option<User> {
    println!("Querying user with ID: {}", id);

    let user = USERS.with(|users| {
        users.borrow().get(&id).cloned()
    });

    match user {
        Some(u) => {
            println!("User found: {:?}", u);
            Some(u)
        },
        None => {
            println!("User not found: {}", id);
            None
        }
    }
}
```

## 📊 Monitoring & Logging

### 1. **Application Monitoring**

```typescript
// Add performance monitoring
const performanceMonitor = {
  start: (operation: string) => {
    const start = performance.now();
    return {
      end: () => {
        const duration = performance.now() - start;
        console.log(`${operation} took ${duration}ms`);
      },
    };
  },
};

// Usage
const timer = performanceMonitor.start("API Call");
const result = await apiCall("/users");
timer.end();
```

### 2. **Error Tracking**

```typescript
// Error boundary with logging
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error);
    console.error("Error info:", errorInfo);

    // Send to error tracking service
    this.logError(error, errorInfo);
  }

  logError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Implementation for error tracking
  };
}
```

## 🆘 Getting Help

### 1. **Documentation Resources**

- [Development Guide](./01-development-guide.md)
- [Testing Strategy](./02-testing-strategy.md)
- [Frontend Architecture](../03-architecture/02-frontend-architecture.md)
- [Backend Architecture](../03-architecture/03-backend-architecture.md)

### 2. **Community Support**

- GitHub Issues: Report bugs and request features
- Discord: Real-time support and discussions
- Stack Overflow: Tag with `originstamp-icp`

### 3. **Debugging Checklist**

```markdown
- [ ] Check environment variables
- [ ] Verify dependencies are installed
- [ ] Clear cache and rebuild
- [ ] Check console/logs for errors
- [ ] Verify network connectivity
- [ ] Test with minimal reproduction
- [ ] Check recent changes
- [ ] Verify configuration files
```

---

_This troubleshooting guide helps developers quickly resolve common issues and maintain productivity during development._
