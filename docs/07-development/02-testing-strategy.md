# 🧪 Testing Strategy

## Overview

This document outlines the comprehensive testing strategy for OriginStamp ICP, covering unit tests, integration tests, end-to-end tests, and performance testing.

## 🎯 Testing Philosophy

### 1. **Test-Driven Development (TDD)**

- Write tests before implementing features
- Ensure code quality from the start
- Maintain high test coverage
- Continuous integration and deployment

### 2. **Testing Pyramid**

```
    /\
   /  \     E2E Tests (Few)
  /____\    Integration Tests (Some)
 /______\   Unit Tests (Many)
```

### 3. **Quality Gates**

- Minimum 80% code coverage
- All tests must pass before deployment
- Performance benchmarks must be met
- Security tests must pass

## 🧩 Testing Layers

### 1. **Unit Tests**

#### Frontend Unit Tests

```typescript
// components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies correct variant classes', () => {
    render(<Button variant="primary">Primary Button</Button>);
    const button = screen.getByText('Primary Button');
    expect(button).toHaveClass('btn--primary');
  });

  it('disables button when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByText('Disabled Button');
    expect(button).toBeDisabled();
  });
});
```

#### Backend Unit Tests

```rust
// tests/user_management_tests.rs
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_user_registration() {
        let result = register_user(
            "testuser".to_string(),
            "password123".to_string(),
        );

        assert!(result.is_ok());

        let login_result = result.unwrap();
        assert!(login_result.success);
        assert_eq!(login_result.username, Some("testuser".to_string()));
    }

    #[test]
    fn test_duplicate_user_registration() {
        // First registration
        register_user("testuser".to_string(), "password123".to_string()).unwrap();

        // Second registration should fail
        let result = register_user(
            "testuser".to_string(),
            "differentpassword".to_string(),
        );

        assert!(result.is_ok());
        let login_result = result.unwrap();
        assert!(!login_result.success);
        assert_eq!(login_result.message, "Username already exists");
    }

    #[test]
    fn test_user_authentication() {
        // Register user
        register_user("testuser".to_string(), "password123".to_string()).unwrap();

        // Login with correct credentials
        let result = login("testuser".to_string(), "password123".to_string());
        assert!(result.is_ok());

        let login_result = result.unwrap();
        assert!(login_result.success);
        assert_eq!(login_result.username, Some("testuser".to_string()));
    }
}
```

### 2. **Integration Tests**

#### Frontend Integration Tests

```typescript
// tests/integration/auth.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider } from '../../contexts/AuthContext';
import { LoginForm } from '../../components/auth/LoginForm';

describe('Authentication Integration', () => {
  it('handles successful login flow', async () => {
    render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );

    fireEvent.change(screen.getByLabelText('Username'), {
      target: { value: 'testuser' },
    });

    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(screen.getByText('Welcome, testuser')).toBeInTheDocument();
    });
  });

  it('handles login error', async () => {
    render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );

    fireEvent.change(screen.getByLabelText('Username'), {
      target: { value: 'invaliduser' },
    });

    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'wrongpassword' },
    });

    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });
});
```

#### Backend Integration Tests

```rust
// tests/integration/session_tests.rs
#[cfg(test)]
mod integration_tests {
    use super::*;

    #[tokio::test]
    async fn test_complete_session_workflow() {
        // 1. Register user
        let register_result = register_user(
            "testuser".to_string(),
            "password123".to_string(),
        );
        assert!(register_result.is_ok());

        // 2. Create session
        let session_result = create_physical_art_session(
            "testuser".to_string(),
            "Test Art".to_string(),
            "Test Description".to_string(),
        );
        assert!(session_result.is_ok());

        let session_id = session_result.unwrap();

        // 3. Upload photo
        let upload_result = upload_photo_to_session(
            session_id.clone(),
            "https://example.com/photo.jpg".to_string(),
        );
        assert!(upload_result.is_ok());

        // 4. Update session status
        let status_result = update_session_status(
            session_id.clone(),
            "completed".to_string(),
        );
        assert!(status_result.is_ok());

        // 5. Verify session details
        let session = get_session_details(session_id);
        assert!(session.is_some());

        let session_data = session.unwrap();
        assert_eq!(session_data.username, "testuser");
        assert_eq!(session_data.art_title, "Test Art");
        assert_eq!(session_data.status, "completed");
        assert_eq!(session_data.uploaded_photos.len(), 1);
    }
}
```

### 3. **End-to-End Tests**

#### Playwright E2E Tests

```typescript
// tests/e2e/session-workflow.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Session Workflow", () => {
  test("complete session creation and NFT minting", async ({ page }) => {
    // Navigate to login page
    await page.goto("/login");

    // Login
    await page.fill('[data-testid="username-input"]', "testuser");
    await page.fill('[data-testid="password-input"]', "password123");
    await page.click('[data-testid="login-button"]');

    // Wait for dashboard
    await page.waitForURL("/dashboard");

    // Create new session
    await page.click('[data-testid="create-session-button"]');
    await page.fill('[data-testid="art-title-input"]', "My Test Art");
    await page.fill('[data-testid="description-input"]', "Test description");
    await page.click('[data-testid="create-session-submit"]');

    // Wait for session creation
    await page.waitForSelector('[data-testid="session-created"]');

    // Upload photo
    await page.setInputFiles(
      '[data-testid="photo-upload"]',
      "tests/fixtures/test-photo.jpg",
    );
    await page.click('[data-testid="upload-button"]');

    // Wait for upload completion
    await page.waitForSelector('[data-testid="upload-success"]');

    // Complete session
    await page.click('[data-testid="complete-session-button"]');

    // Verify session completion
    await expect(page.locator('[data-testid="session-status"]')).toHaveText(
      "completed",
    );

    // Mint NFT
    await page.click('[data-testid="mint-nft-button"]');
    await page.waitForSelector('[data-testid="nft-minted"]');

    // Verify NFT creation
    await expect(page.locator('[data-testid="nft-token-id"]')).toBeVisible();
  });
});
```

### 4. **Performance Tests**

#### Frontend Performance Tests

```typescript
// tests/performance/component-performance.test.tsx
import { render } from '@testing-library/react';
import { SessionList } from '../../components/dashboard/SessionList';

describe('SessionList Performance', () => {
  it('renders large session list efficiently', () => {
    const largeSessionList = Array.from({ length: 1000 }, (_, i) => ({
      id: `session-${i}`,
      title: `Session ${i}`,
      description: `Description for session ${i}`,
      status: 'completed',
      createdAt: new Date().toISOString(),
    }));

    const startTime = performance.now();

    render(<SessionList sessions={largeSessionList} />);

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    // Should render in less than 100ms
    expect(renderTime).toBeLessThan(100);
  });
});
```

#### Backend Performance Tests

```rust
// tests/performance/backend_performance.rs
#[cfg(test)]
mod performance_tests {
    use super::*;

    #[test]
    fn test_bulk_session_creation() {
        let start_time = std::time::Instant::now();

        for i in 0..100 {
            let result = create_physical_art_session(
                format!("user{}", i),
                format!("Art {}", i),
                format!("Description {}", i),
            );
            assert!(result.is_ok());
        }

        let duration = start_time.elapsed();

        // Should create 100 sessions in less than 1 second
        assert!(duration.as_millis() < 1000);
    }

    #[test]
    fn test_large_dataset_query() {
        // Create 1000 sessions
        for i in 0..1000 {
            create_physical_art_session(
                "testuser".to_string(),
                format!("Art {}", i),
                format!("Description {}", i),
            ).unwrap();
        }

        let start_time = std::time::Instant::now();

        let sessions = get_user_sessions("testuser".to_string());

        let duration = start_time.elapsed();

        // Should query 1000 sessions in less than 100ms
        assert!(duration.as_millis() < 100);
        assert_eq!(sessions.len(), 1000);
    }
}
```

## 🛠️ Testing Tools

### 1. **Frontend Testing Stack**

```json
{
  "devDependencies": {
    "@testing-library/react": "^13.0.0",
    "@testing-library/jest-dom": "^5.16.0",
    "@testing-library/user-event": "^14.0.0",
    "jest": "^28.0.0",
    "playwright": "^1.30.0",
    "vitest": "^0.30.0"
  }
}
```

### 2. **Backend Testing Stack**

```toml
[dependencies]
tokio = { version = "1.0", features = ["full"] }
criterion = "0.4"

[dev-dependencies]
mockall = "0.11"
```

### 3. **Test Configuration**

#### Jest Configuration

```javascript
// jest.config.js
module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  moduleNameMapping: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/index.tsx",
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

#### Vitest Configuration

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./src/setupTests.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  },
});
```

## 📊 Test Coverage

### 1. **Coverage Targets**

- **Unit Tests**: 90% coverage
- **Integration Tests**: 80% coverage
- **E2E Tests**: Critical user flows
- **Performance Tests**: Key performance indicators

### 2. **Coverage Reports**

```bash
# Generate coverage reports
npm run test:coverage

# View coverage in browser
npm run test:coverage:view
```

### 3. **Coverage Badges**

```markdown
![Test Coverage](https://img.shields.io/badge/coverage-85%25-green)
![Build Status](https://img.shields.io/badge/build-passing-green)
```

## 🔄 CI/CD Integration

### 1. **GitHub Actions Workflow**

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:unit

      - name: Run integration tests
        run: npm run test:integration

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Generate coverage report
        run: npm run test:coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
```

### 2. **Test Scripts**

```json
{
  "scripts": {
    "test": "vitest",
    "test:unit": "vitest --run",
    "test:integration": "vitest --run --config vitest.integration.config.ts",
    "test:e2e": "playwright test",
    "test:coverage": "vitest --coverage",
    "test:watch": "vitest --watch",
    "test:debug": "vitest --inspect-brk"
  }
}
```

## 🧪 Test Data Management

### 1. **Test Fixtures**

```typescript
// tests/fixtures/sessions.ts
export const mockSessions = [
  {
    id: "session-1",
    title: "Test Art 1",
    description: "Test description 1",
    status: "completed",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "session-2",
    title: "Test Art 2",
    description: "Test description 2",
    status: "in_progress",
    createdAt: "2024-01-02T00:00:00Z",
  },
];
```

### 2. **Test Utilities**

```typescript
// tests/utils/test-utils.tsx
import { render } from '@testing-library/react';
import { AuthProvider, ThemeProvider } from '../../contexts';

export const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <AuthProvider>
      <ThemeProvider>
        {ui}
      </ThemeProvider>
    </AuthProvider>
  );
};
```

## 🔒 Security Testing

### 1. **Security Test Cases**

```typescript
// tests/security/auth-security.test.ts
describe('Authentication Security', () => {
  it('prevents SQL injection in login', async () => {
    const maliciousInput = "'; DROP TABLE users; --";

    const result = await login(maliciousInput, 'password');

    expect(result.success).toBe(false);
    expect(result.message).toContain('Invalid credentials');
  });

  it('prevents XSS in user input', () => {
    const maliciousInput = '<script>alert("xss")</script>';

    render(<UserProfile username={maliciousInput} />);

    const element = screen.getByText(maliciousInput);
    expect(element.innerHTML).not.toContain('<script>');
  });
});
```

### 2. **Penetration Testing**

```bash
# Run security tests
npm run test:security

# Run OWASP ZAP scan
npm run test:zap
```

## 📈 Performance Testing

### 1. **Load Testing**

```typescript
// tests/performance/load-test.ts
import { chromium } from "playwright";

test("handle concurrent users", async () => {
  const browser = await chromium.launch();
  const contexts = await Promise.all(
    Array.from({ length: 10 }, () => browser.newContext()),
  );

  const startTime = performance.now();

  await Promise.all(
    contexts.map(async (context) => {
      const page = await context.newPage();
      await page.goto("/dashboard");
      await page.waitForLoadState("networkidle");
    }),
  );

  const duration = performance.now() - startTime;
  expect(duration).toBeLessThan(5000); // 5 seconds
});
```

### 2. **Memory Leak Testing**

```typescript
// tests/performance/memory-leak.test.ts
test('no memory leaks in component', () => {
  const initialMemory = performance.memory?.usedJSHeapSize || 0;

  for (let i = 0; i < 100; i++) {
    const { unmount } = render(<ExpensiveComponent />);
    unmount();
  }

  const finalMemory = performance.memory?.usedJSHeapSize || 0;
  const memoryIncrease = finalMemory - initialMemory;

  // Memory increase should be minimal
  expect(memoryIncrease).toBeLessThan(1024 * 1024); // 1MB
});
```

## 📚 Related Documentation

- **[Development Guide](./01-development-guide.md)** - Development standards
- **[Troubleshooting](./03-troubleshooting.md)** - Common testing issues
- **[Frontend Architecture](../03-architecture/02-frontend-architecture.md)** - Frontend testing patterns
- **[Backend Architecture](../03-architecture/03-backend-architecture.md)** - Backend testing patterns

---

_This testing strategy ensures high code quality, reliability, and performance for the OriginStamp ICP platform._
