# Add New Canister Function

Your goal is to help me implement a new function for my Internet Computer canister.

If not provided, ask for:

- Function name
- Function purpose
- Whether it's a query or update function
- Parameters and return type

## Implementation Requirements:

- For query functions, use `#[ic_cdk::query]` annotation
- For update functions, use `#[ic_cdk::update]` annotation
- Use thread_local for state management if needed
- Follow Rust best practices and existing code style
- Ensure the `export_candid!()` macro is still called

## Example Implementation:

```rust
#[ic_cdk::query]
fn get_user_data(user_id: String) -> Option<UserData> {
    USER_DATA.with(|data| {
        data.borrow().get(&user_id).cloned()
    })
}
```

Reference canister implementation: [lib.rs](../../src/vibe_coding_template_backend/src/lib.rs)
