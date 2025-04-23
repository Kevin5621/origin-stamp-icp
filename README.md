# VIBE Coding Template

A streamlined template for Internet Computer Protocol (ICP) Rust development following best practices. This template is designed to help developers quickly set up a well-structured ICP project with proper testing infrastructure.

## Features

- **Rust Backend**: Ready-to-use Rust canister setup optimized for ICP development
- **Testing Infrastructure**: Comprehensive testing setup using:
  - PocketIC for local canister simulation
  - Vitest as the test runner for fast, parallel tests
  - End-to-end test examples for both query and update calls
- **CI/CD Pipeline**: GitHub Workflows for continuous integration that automatically:
  - Build canisters
  - Run tests
  - Validate code quality
- **DFX Configuration**: Properly configured dfx.json with custom build steps for Rust canisters

## Getting Started

```bash
# Clone the repository
git clone https://github.com/pt-icp-hub/ICP-Bootcamp-Vibe-Coding.git

# Install dependencies
npm install

# Start the local replica (required for development)
dfx start --background --clean

# Build the canisters
dfx build

# Run tests
npm test
```

## Project Structure

```
├── src/                          # Source code
│   ├── vibe_coding_template_backend/  # Backend canister
│   │   ├── src/                  # Rust source files
│   │   └── Cargo.toml            # Rust dependencies
│   └── declarations/             # Auto-generated canister interfaces
├── tests/                        # Test files
│   ├── src/                      # Test source files
│   ├── global-setup.ts           # PocketIC setup for tests
│   └── vitest.config.ts          # Vitest configuration
├── dfx.json                      # Internet Computer configuration
├── Cargo.toml                    # Workspace configuration
└── .github/workflows/            # CI/CD configurations
```

## Testing

The template demonstrates testing best practices for ICP development:

```bash
# Run all tests
npm test

# Run tests in watch mode during development
npm test -- --watch

# Run specific tests
npm test -- tests/src/specific-test.ts
```

### Testing Patterns

This template showcases several key testing patterns:

1. **Canister lifecycle testing**: Setup, upgrade, and reinstall scenarios TODO
2. **Query function testing**: Fast, read-only operations
3. **Update function testing**: State-changing operations
4. **Error handling testing**: Proper error conditions verification

## CI/CD

The GitHub workflows automatically:

- Build all canisters
- Run the test suite
- Provide feedback on pull requests

This ensures code quality is maintained throughout development.

## Learning Resources

This template serves as a learning resource for:

- Rust canister development on ICP
- Proper testing patterns
- CI/CD integration
- Project structure best practices

## Status

This template is actively maintained and expanded. Contributions and suggestions are welcome!

## License

[MIT](LICENSE)
