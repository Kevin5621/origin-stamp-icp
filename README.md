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

# Generate type declarations for canisters
dfx generate

# Build target files
cargo build --target wasm32-unknown-unknown --release --package vibe_coding_template_backend

# Run tests
npm test

# Start the local replica (required for development)
dfx start --background --clean

# Deploy the canisters locally
dfx deploy
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

## GitHub Copilot Integration

This project includes custom instructions for GitHub Copilot to enhance development productivity. When using GitHub Copilot with this repository, it will automatically:

- **Generate Tests** for new canister functions following our testing patterns
- **Update the Changelog** with entries for new features in the proper format
- **Follow ICP Best Practices** when suggesting code for canister development

### How It Works

The repository contains a `.github/copilot-instructions.md` file that provides Copilot with context about:

1. **Canister Function Implementation**: Proper annotations for query and update functions
2. **Test Structure**: PocketIC testing patterns with proper setup/teardown hooks
3. **Changelog Format**: Keep a Changelog format for documenting changes

This ensures consistent code quality and documentation across the project without having to manually remind contributors of these standards.

### Example

When you write a new function in `lib.rs`, Copilot will suggest:

- Appropriate test cases in the test files
- Changelog entries in the correct format
- Proper Rust annotations and patterns for ICP development

No additional configuration is needed - these instructions are automatically applied whenever you use Copilot within this repository.

## Learning Resources

This template serves as a learning resource for:

- Rust canister development on ICP
- Proper testing patterns
- CI/CD integration
- Project structure best practices

### Testing GitHub Copilot Integration

You can test the GitHub Copilot integration by asking it to implement a new function in the counter example. Here's how:

1. Open the `src/vibe_coding_template_backend/src/lib.rs` file
2. Position your cursor at the end of the file, before the `export_candid!();` line
3. Type a comment prompting Copilot to create the function:
   ```rust
   // Add a function to decrease the counter value
   ```
4. Wait for Copilot to suggest the implementation or press Ctrl+Enter to invoke suggestions
5. Accept the suggestion, which should look similar to:
   ```rust
   #[ic_cdk::update]
   fn decrease() -> u64 {
       COUNTER.with(|counter| {
           let val = counter.borrow().saturating_sub(1);
           *counter.borrow_mut() = val;
           val
       })
   }
   ```
6. Copilot will also help you:
   - Generate appropriate tests in `tests/src/vibe_coding_template_backend.test.ts`
   - Create a changelog entry in `CHANGELOG.md`

This simple example demonstrates how Copilot understands the project structure, coding patterns, and documentation requirements.

## Status

This template is actively maintained and expanded. Contributions and suggestions are welcome!

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of all changes and releases.

## License

[MIT](LICENSE)
