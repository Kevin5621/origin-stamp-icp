# Vibe Coding Template Instructions

## Project Context

This is an Internet Computer Protocol (ICP) project using Rust for canister development with PocketIC and Vitest for testing.

## Core Development Guidelines

### Implementing Step-by-Step Workflow on Features with GitHub Copilot Agent Mode

Only when working on features, follow this step-by-step approach with GitHub Copilot Agent Mode.

#### Step-by-Step Workflow

Please follow a Spec Driven Development workflow. Here are explicit steps for you to strictly follow:

1.  First, ensure you fully understand the problem, feel free to ask a few clarification questions and PAUSE.
2.  Update the changelog with the requested feature.
3.  Then, create a new method, if needed, without actual logic and regenerate Candid.
4.  Then, write tests, also implement important error cases that you feel are worth testing, ensure it's failing and request review and PAUSE.
5.  Then, implement code changes according to the tests described.
6.  Finally, run tests and ensure it's passing.

#### Extra instructions

1.  **After developer answers clarification questions, give a summary of the workflow**:

    ```
    Let's implement [feature] in Spec Driven Development steps:
    1. First, let's update the changelog.
    2. Then, we'll create a new method, if needed, and regenerate Candid.
    3. Then, we'll write tests and ensure it's failing
    4. Then, we'll implement the code
    5. Finally, we'll run tests and ensure it's passing

    Let's start with step 1 - here's my proposed changelog entry:
    [changelog entry]
    ```

2.  **Use the information from previous steps**:
    ```
    Based on the confirmed tests for [feature], let's write code that would satisfy this functionality.
    ```

### How to generate candid

If you make changes in the interface of the backend, you should run this command in the terminal.

```bash
npm run generate-candid
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
