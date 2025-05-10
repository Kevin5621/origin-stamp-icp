# 🧪🔥 IC Vibe Coding Bootcamp - Rust Edition

Welcome to the **IC Vibe Coding Bootcamp (Rust Edition)**! This repository provides a high-quality, production-style template to help you kickstart Internet Computer (ICP) backend development using **Rust**, with best practices in testing, CI/CD, and developer experience.

Whether you're building your first ICP project or want a fast way to set up a maintainable Rust canister architecture, this template is your launchpad. 🚀

---

## 📜 Table of Contents
- [✨ Features](#-features)
- [🚀 Getting Started](#-getting-started)
- [📁 Project Structure](#-project-structure)
- [✅ Testing Patterns](#-testing-patterns)
- [🔄 CI/CD Workflow](#-cicd-workflow)
- [🧠 GitHub Copilot Integration](#-github-copilot-integration)
- [🔗 Resources & Documentation](#-learning-resources)
- [📩 Submit Your Project!](#-submit-your-project)

---

## ✨ Features

- 🦀 **Rust-based Canister Template**
- 🧪 **Test Suite**: Powered by Vitest + PocketIC for realistic canister simulation
- 🔁 **CI/CD**: GitHub Actions to automate builds, tests, and code quality checks
- 📦 **DFX Config**: Pre-configured with best practices for Rust
- 🤖 **Copilot Integration**: Automatically generate structured tests & changelogs

---

## 🚀 Getting Started

### 🧑‍💻 1. Get Codespace Ready

A **devcontainer** is preconfigured for you to start coding instantly!

- Click on "Use this Template" → "Create a new repository".
- Click "Code → Open with Codespaces"
- Once the codespace is created, you can open it in VS Code Local
- Everything is pre-installed and ready for you to run the following commands

### 2. Install Dependencies

```bash
npm install
```

### 3. Build Canisters
<!-- TODO: Check if needed. Maybe dfx build or the dfx deploy are already doing this? -->
```bash
dfx generate
cargo build --target wasm32-unknown-unknown --release --package vibe_coding_template_backend
```

### 4. Start Local Blockchain Environment

```bash
dfx start --clean
```
Keep this tab open for reading logs.

### 5. Deploy Locally

Open a new tab, then:
```bash
dfx deploy
```

### 6. Run Tests
<!-- TODO: There is a yellow warning about Vite's Node API being deprecated. Consider fixing. -->
```bash
npm test
```

You can also run:
```bash
npm test tests/src/vibe_coding_template_backend.test.ts    # individual test
```

---

## 📁 Project Structure

```
ICP-Bootcamp-Vibe-Coding/
├── src/
│   ├── vibe_coding_template_backend/     # Rust backend canister
│   │   ├── src/                          # Rust source files
│   │   └── Cargo.toml                    # Rust dependencies
│   └── declarations/                     # Auto-generated canister interfaces
├── tests/
│   ├── src/                              # Test files
│   ├── global-setup.ts                   # PocketIC instance
│   └── vitest.config.ts                  # Vitest configuration
├── dfx.json                              # ICP config
├── Cargo.toml                            # Root Rust workspace config
├── .github/workflows/                    # GitHub CI/CD pipelines
├── .github/copilot-instructions.md       # Copilot Feature-Test Loop Instructions
└── CHANGELOG.md
```

---

## ✅ Testing Patterns

This template demonstrates ICP testing best practices:
<!-- TODO: As it is, it's useless. Consider refactor or removal -->
- **Query Function Testing**: Fast, read-only
- **Update Function Testing**: State-changing logic
- **Error Handling**: Expected failure validation

---

## 🔄 CI/CD Workflow

Located under `.github/workflows/`, this includes:

- 🧪 Automated end-2-end test runs

It could be extended to:
- check for format;
- check for security updates (audit);
- test coverage;
- code quality.

---

## 🧠 GitHub Copilot Integration

This project includes a `.github/copilot-instructions.md` file that helps Copilot:

- Generate test cases for each new function
- Suggest changelog entries
- Follow best practices for query/update annotations

### ✨ Example Prompt
```rust
// Add a function to decrease the counter value
```
Copilot will suggest:
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
It will also:
- Create a matching test in `tests/src/`
- Update the `CHANGELOG.md`

---

## 📚 Learning Resources

- [ICP Dev Docs](https://internetcomputer.org/docs)
- [Rust CDK](https://internetcomputer.org/docs/current/developer-docs/backend/rust/)
- [PicJS Doc](https://dfinity.github.io/pic-js/)
- [Vitest Testing Framework](https://vitest.dev/)

---

## 📩 Submit Your Project!

🎯 **Completed your challenge? Submit your project here:**  
📢 [Submission Form](https://forms.gle/Sgmm1y2bLXYY7mwC6)  

📌 **Want to explore more challenges? Return to the index:**  
🔗 [IC Vibe Coding Bootcamp Index](https://github.com/pt-icp-hub/IC-Vibe-Coding-Bootcamp-Index) 

---

**Now go build something fast, tested, and production-ready 🚀🦀**
