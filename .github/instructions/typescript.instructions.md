---
applyTo: "**/*.tsx"
---

### Frontend and Typescript Instructions

- This project uses Vite, React, Typescript, and Tailwind CSS.
- IMPORTANT: Tailwind CSS is v4, which is a major version upgrade from v3. Please refer to the [migration guide](https://tailwindcss.com/docs/upgrade-guide) for any breaking changes.
- Please use the dedicated Vite Plugin for Tailwind CSS (`@tailwindcss/vite`) instead of PostCSS plugin.
- Always prefer Tailwind CSS utility classes over custom CSS.
- Follow TypeScript best practices with proper type annotations.

## Useful Commands

You can self check your frontend code using the following command:

```bash
npm run start
```

And opening the SimpleBrowser at `http://localhost:5173`.

## Component Structure

- Use functional components with React hooks
- Organize components with clear separation of concerns
- Use TypeScript interfaces for props and state
- Export components from barrel files for cleaner imports

Example:

```tsx
interface UserProfileProps {
  userId: string;
  displayName: string;
  onUpdate?: (userId: string) => void;
}

export function UserProfile({
  userId,
  displayName,
  onUpdate,
}: UserProfileProps) {
  // Component implementation
}
```

## Tailwind CSS Usage

IMPORTANT: Please don't create a tailwind.config.js file to add custom classes.
Instead, use directives in your SCSS files. This is a feature in Tailwind CSS v4 that allows you to create custom classes using existing utility classes.

Example:

```scss
@theme {
  --color-mint-500: oklch(0.72 0.11 178);
}
```

## State Management

- Use React Context API for global state when appropriate
- Prefer local component state when possible
- Consider using custom hooks for reusable state logic

## Internet Computer Integration

- Import canister declarations from the declarations directory
- Use async/await with proper loading state and error handling for canister calls
- Create separate service layers to interact with canisters
- Add type definitions for all canister responses

Example:

```typescript
import { backend } from "../../declarations/backend";

// Service function
export async function fetchUserData(userId: string): Promise<UserData> {
  try {
    return await backend.get_user_data(userId);
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    throw error;
  }
}
```
