# Vibe Coding Template Instructions

## Project Context

This is an Internet Computer Protocol (ICP) project using Rust for canister development with PocketIC and Vitest for testing.

## Core Development Guidelines

### Adding New Canister Functions

When implementing a new function for the Internet Computer canister:

- For query functions, use `#[ic_cdk::query]` annotation
- For update functions, use `#[ic_cdk::update]` annotation
- Use thread_local for state management if needed
- Follow Rust best practices and existing code style
- Ensure the `export_candid!()` macro is still called

Example implementation:

```rust
#[ic_cdk::query]
fn get_user_data(user_id: String) -> Option<UserData> {
    USER_DATA.with(|data| {
        data.borrow().get(&user_id).cloned()
    })
}
```

After adding a new function, always run the following command in the terminal:

```
npm run generate-candid <CANISTER_NAME> && dfx generate
```

### Writing Tests for Canister Functions

When writing tests for canister functions:

- Use PocketIC for canister testing
- Follow the existing test structure with beforeEach/afterEach hooks
- Include setup, execution, and assertion phases in each test
- Test both happy path and error cases
- Use descriptive test names that explain the expected behavior

Example test structure:

```typescript
it("should correctly handle [specific scenario]", async () => {
  // Setup
  const testData = { key: "value" };

  // Execute
  const result = await actor.yourFunction(testData);

  // Assert
  expect(result).toEqual(expectedResult);
});
```

### Updating the Changelog

When adding new features or making changes:

- Follow Keep a Changelog format
- Add entries under the [Unreleased] > appropriate section (Added, Changed, Fixed, etc.)
- Use clear, concise descriptions that explain the impact to users
- Start each entry with a verb in present tense (Add, Fix, Change)

Example changelog entry:

```markdown
## [Unreleased]

### Added

- Add user profile management with support for avatars and display names
```

## Important Files

- Canister implementation: src/vibe_coding_template_backend/src/lib.rs
- Test file: tests/src/vibe_coding_template_backend.test.ts
- Changelog: CHANGELOG.md
