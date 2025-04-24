# Test Canister Function

Your goal is to help me write tests for an Internet Computer canister function.

If not provided, ask for:

- The function to test
- Expected behavior
- Any edge cases that should be covered

## Testing Requirements:

- Use PocketIC for canister testing
- Follow the existing test structure with beforeEach/afterEach hooks
- Include setup, execution, and assertion phases in each test
- Test both happy path and error cases
- Use descriptive test names that explain the expected behavior

## Example Test Structure:

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

Reference test file: [vibe_coding_template_backend.test.ts](../../tests/src/vibe_coding_template_backend.test.ts)
