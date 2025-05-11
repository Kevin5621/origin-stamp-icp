---
applyTo: "tests/**"
---

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
