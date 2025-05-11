---
applyTo: "**"
---

# Vibe Coding Template Instructions

## Project Context

This is an Internet Computer Protocol (ICP) project using Rust for canister development with PocketIC and Vitest for testing.

### Project Formatter and Linter

- Rust: We use `rust-lang.rust-analyzer` for formatting and linting.
- TypeScript: Use `prettier` for formatting and linting.
- For both Rust and Typescript, ensure to run `npm run lint` and `npm run format` before committing any changes.
- For Rust only, run `cargo fmt` and `cargo clippy` before committing any changes.

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

If you make changes in Typescript test files, you should self-check for errors by running the following command.

```bash
npx tsc -p tests/tsconfig.json
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
