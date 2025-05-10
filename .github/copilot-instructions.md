# Vibe Coding Template Instructions

## Project Context

This is an Internet Computer Protocol (ICP) project using Rust for canister development with PocketIC and Vitest for testing.

## Core Development Guidelines

### Implementing Step-by-Step Workflow on Features with GitHub Copilot Agent Mode

Only when working on features, follow this step-by-step approach with GitHub Copilot Agent Mode.

#### Step-by-Step Workflow

IMPORTANT: When you see "CRITICAL PAUSE POINT!" in these instructions, you MUST stop immediately and wait for human feedback before proceeding to the next step. Do not continue past any CRITICAL PAUSE POINT instruction without explicit approval.

Please follow a Spec Driven Development workflow. Here are explicit steps for you to strictly follow:

1.  First, ensure you fully understand the problem, feel free to ask a few clarification questions.
2.  **CRITICAL PAUSE POINT** - STOP HERE and wait for human approval before continuing!
3.  Update the changelog with the requested feature.
4.  Then, if needed, create a new method without actual logic.
5.  Regenerate Candid and Cargo check.
6.  Then, write tests, also implement important error cases that you feel are worth testing.
7.  Then check the file for any typescript error.
8.  Then run tests and ensure it's failing. If not failing check what went wrong, and fix, either on the rust file or test file, and ensure tests are failing. If they don't fail, you aren't testing anything.
9.  **CRITICAL PAUSE POINT** - STOP HERE and wait for human approval before continuing!
10. Then, implement code changes according to the tests described.
11. Finally, run tests and ensure it's passing.

### How to generate candid

If you make changes in the interface of the backend, you should run this command in the terminal.

```bash
npm run generate-candid
```

### How to cargo check

If you make changes in Rust files, you should self-check for errors by running the following command.

```bash
cargo check
```

### How to check Typescript file

If you make changes in Typescript files, you should self-check for errors by running the following command.

```bash
npx tsc --noEmit <file relative path>
```

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

```bash
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
it("should [expected consequence]", async () => {
  // Setup
  const testData = { key: "value" };

  // Execute
  const result = await actor.yourFunction(testData);

  // Assert
  expect(result).toEqual(expectedResult);
});
```

After writing the tests please check they are all passing by executing:

```bash
npm test <file relative path>
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
