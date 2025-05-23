---
applyTo: "**/src/frontend/**"
---

### Writing Tests for Frontend Components

When writing tests for frontend components:

- Use Vitest and React Testing Library for testing React components
- Follow the existing test structure with describe/it blocks
- Include setup, execution, and assertion phases in each test
- Test both happy path and edge cases
- Use descriptive test names that explain the expected behavior
- Use mocks for backend canister functions when testing frontend components
- IMPORTANT: don't create component tests, only test at view level.

Example test structure:

```typescript
describe("ComponentName", () => {
  it("should [expected behavior]", () => {
    // Setup
    render(
      <StrictMode>
        <ComponentName prop1="value" />
      </StrictMode>
    );

    // Execute
    const element = screen.getByText("Expected Text");
    // Or for user interactions
    userEvent.click(screen.getByRole("button", { name: "Click Me" }));

    // Assert
    expect(element).toBeInTheDocument();
    expect(screen.getByText("Result")).toBeVisible();
  });
});
```

For testing components that interact with canister functions:

```typescript
// Mock the backend canister
vi.mock("../../declarations/backend", () => ({
  backend: {
    yourFunction: vi.fn().mockResolvedValue(expectedResult),
  },
}));

it("should interact with backend canister", async () => {
  // Setup
  render(<YourComponent />);

  // Execute
  await userEvent.click(screen.getByRole("button"));

  // Assert
  expect(await screen.findByText("Success")).toBeInTheDocument();
  expect(backend.yourFunction).toHaveBeenCalledWith(expectedParams);
});
```

After writing the tests, check that they are all passing by executing:

```bash
npm run test:frontend
```

To run a specific test file:

```bash
npm run test:frontend -- src/frontend/tests/YourComponent.test.tsx
```
