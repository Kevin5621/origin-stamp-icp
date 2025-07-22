# Backend Test Documentation

This directory contains comprehensive unit tests for the backend canister functions. The tests are built using Vitest and PocketIC for canister simulation.

## Test Structure

### Files

- `backend-test-setup.ts` - Test environment setup and configuration
- `src/backend.test.ts` - Main test suite with all backend function tests
- `types.d.ts` - Type definitions for testing environment
- `vitest.config.ts` - Vitest configuration
- `tsconfig.json` - TypeScript configuration for tests

### Environment Configuration

Tests use environment variables loaded from `.env` file for S3 configuration:

```bash
# S3 Configuration for Development & Testing
S3_ACCESS_KEY=your_access_key_here
S3_SECRET_KEY=your_secret_key_here
S3_REGION=your_region_here
S3_ENDPOINT=https://your-s3-endpoint.com/  # Optional
S3_BUCKET_NAME=your_bucket_name
```

## Helper Functions

### `getS3ConfigFromEnv()`

Located in `backend.test.ts`, this helper function loads S3 configuration from environment variables with proper type checking:

```typescript
function getS3ConfigFromEnv() {
  return {
    bucket_name: process.env.S3_BUCKET_NAME || "test-bucket",
    region: process.env.S3_REGION || "us-east-1",
    access_key_id: process.env.S3_ACCESS_KEY || "test-key",
    secret_access_key: process.env.S3_SECRET_KEY || "test-secret",
    endpoint: (process.env.S3_ENDPOINT ? [process.env.S3_ENDPOINT] : []) as
      | []
      | [string],
  };
}
```

## Test Categories

### User Management Tests

- User registration with various input formats
- Login functionality
- Username validation (whitespace, case sensitivity)
- Concurrent user operations
- Edge cases with special characters and long usernames

### Physical Art Session Tests

- Session creation with complete data validation
- Session status updates and transitions
- Session details retrieval
- Photo upload and removal
- Concurrent operations on sessions
- Data integrity across multiple operations

### S3 Integration Tests

- S3 configuration management
- Upload URL generation
- Custom endpoint handling
- Configuration validation
- Error handling for missing configuration

### Edge Case and Data Integrity Tests

- Large data handling (long titles, descriptions)
- Special characters and Unicode support
- Malformed URL handling
- Duplicate photo URL handling
- Concurrent operations testing
- Invalid configuration handling

## Test Patterns

### Standard Test Structure

```typescript
it("should [expected behavior]", async () => {
  // Setup
  const testData = {
    /* test data */
  };

  // Execute
  const result = await actor.someFunction(testData);

  // Assert
  expect("Ok" in result).toBe(true);
  if ("Ok" in result) {
    expect(result.Ok).toEqual(expectedValue);
  }
});
```

### Error Testing Pattern

```typescript
it("should handle [error condition]", async () => {
  // Execute with invalid input
  const result = await actor.someFunction(invalidInput);

  // Assert error response
  expect("Err" in result).toBe(true);
  if ("Err" in result) {
    expect(result.Err).toBe("Expected error message");
  }
});
```

### Concurrent Operations Pattern

```typescript
it("should handle concurrent [operation]", async () => {
  // Setup multiple promises
  const promises = Array.from({ length: 5 }, (_, i) =>
    actor.someFunction(generateTestData(i)),
  );

  // Execute concurrently
  const results = await Promise.all(promises);

  // Verify all operations succeeded
  results.forEach((result) => {
    expect("Ok" in result).toBe(true);
  });
});
```

## Dependencies

The following packages are required for testing:

- `@dfinity/agent` - Internet Computer agent for canister communication
- `@dfinity/candid` - Candid serialization for IC types
- `@pocket-ic/pic` - PocketIC for canister simulation
- `dotenv` - Environment variable loading
- `vitest` - Test runner and framework

## Running Tests

### All Backend Tests

```bash
npm run test:backend
```

### TypeScript Check

```bash
npx tsc -p tests/tsconfig.json --noEmit
```

### Code Formatting

```bash
npm run format
```

## Coverage Areas

The test suite provides comprehensive coverage for:

1. **Happy Path Testing** - Normal operation flows
2. **Error Handling** - Invalid inputs and edge cases
3. **Concurrency** - Multiple operations running simultaneously
4. **Data Integrity** - Consistency across operations
5. **Input Validation** - Boundary conditions and special characters
6. **Configuration Management** - S3 setup and validation
7. **State Management** - Session status transitions
8. **Resource Management** - Photo uploads and removals

## Best Practices Followed

- ✅ Descriptive test names explaining expected behavior
- ✅ Setup/Execute/Assert structure
- ✅ Proper error handling and type checking
- ✅ Environment-based configuration
- ✅ Comprehensive edge case coverage
- ✅ Concurrent operation testing
- ✅ Data integrity validation
- ✅ Resource cleanup in test hooks

## Extending Tests

When adding new backend functions:

1. Follow the existing test patterns
2. Include both success and error cases
3. Test with edge cases (empty strings, special characters, large data)
4. Consider concurrent operation scenarios
5. Update this documentation with new patterns or helpers
6. Ensure TypeScript compilation passes
7. Verify all tests pass before committing

## Environment Setup

Ensure `.env` file exists with required S3 configuration. The test environment automatically loads these variables and provides fallback values for missing configuration.

The following dependency has been added for environment variable support:

- `dotenv`: For loading environment variables from `.env` file

### 3. Test Setup

The backend test setup (`tests/backend-test-setup.ts`) now:

- Imports and configures `dotenv` to load environment variables
- Makes environment variables available to all test files

## Test Implementation

### Helper Function

A new helper function `getS3ConfigFromEnv()` in `tests/src/backend.test.ts`:

- Reads S3 configuration from environment variables
- Provides fallback default values for testing
- Logs configuration (with masked secrets) for debugging
- Returns properly typed configuration object

### Updated Tests

All S3-related tests now use the environment configuration:

- `should configure S3 settings successfully`
- `should set S3 config successfully (alias)`
- `should get S3 config status when configured`
- `should get S3 configuration`
- `should generate upload URL when S3 is configured`
- `should generate upload URL with custom endpoint`

## Benefits

1. **Flexible Configuration**: Tests can use different S3 configurations without code changes
2. **Real Environment Testing**: Tests can use actual S3 credentials for integration testing
3. **Security**: Sensitive credentials are kept in `.env` files, not hardcoded
4. **Consistency**: Same configuration pattern used across development and testing
5. **Debugging**: Configuration values are logged (with secrets masked) for troubleshooting

## Running Tests

```bash
# Run all backend tests
npm run test:backend

# The tests will automatically load configuration from .env
# and show the loaded values in the console output
```

## Configuration Examples

### AWS S3

```bash
S3_ACCESS_KEY=AKIAIOSFODNN7EXAMPLE
S3_SECRET_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
S3_REGION=us-east-1
S3_ENDPOINT=https://s3.amazonaws.com
S3_BUCKET_NAME=my-test-bucket
```

### MinIO (Local Development)

```bash
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
S3_REGION=us-east-1
S3_ENDPOINT=http://localhost:9000
S3_BUCKET_NAME=test-bucket
```

### Custom S3-Compatible Service

```bash
S3_ACCESS_KEY=your_access_key
S3_SECRET_KEY=your_secret_key
S3_REGION=ap-southeast-1
S3_ENDPOINT=https://s3.csalab.dev/
S3_BUCKET_NAME=assets
```
