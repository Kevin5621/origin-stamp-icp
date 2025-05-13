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

### 3. Start Local Blockchain Environment

```bash
dfx start
```

Keep this tab open for reading logs.

### 4. Deploy Locally

Open a new tab, then:

```bash
dfx deploy
```

### 5. Run Tests

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
├── scripts/
│   ├── dev-container-setup.sh            # Extra set up steps for codespace
│   └── generate-candid.sh                # Useful one way script to build, generate candid and did files
├── dfx.json                              # ICP config
├── Cargo.toml                            # Root Rust workspace config
├── .github/instructions/                 # Copilot general and language specific instructions
├── .github/prompts/                      # Copilot Prompts, like add feature and changes review
├── .github/workflows/                    # GitHub CI/CD pipelines
├── .devcontainer/devcontainer.json       # Container config for running your own codespace
└── CHANGELOG.md
```

---

## 🔄 CI/CD Workflow

Located under `.github/workflows/`, this includes:

- 🧪 Automated end-2-end test runs

It could be extended to:

- check for security updates (audit);
- test coverage;
- code quality.

---

## 🧠 **GitHub Copilot Integration**

This project leverages two key customization folders:

- `.github/instructions/` – Provides essential context to guide AI responses.
- `.github/prompts/` – Defines workflow prompts to effectively assist you.

Think of the AI as a super-fast junior developer, handling the heavy lifting while you focus on quality control. Instead of using PRs, you’re reviewing and refining code directly in the IDE through Copilot chat.

### 📝 **About Instructions**

Instructions provide "context" that applies to specific files using regex patterns defined in `applyTo`. They are ideal for project-wide or language-specific guidance.

**Current Instructions:**

- **general:** `applyTo: **`
- **rust:** `applyTo: */*.rs`
- **test:** `applyTo: tests/**`

**Examples of Context You Can Define:**

- This is an ICP project using Rust canisters.
- For Rust, we follow Clippy and Rust FMT style guides and linting tools.
- For tests, we use **Pocket IC** and maintain a specific test structure.

### 🛠️ **About Prompts**

Prompts define specific tasks and guide the AI through a structured workflow. They are especially useful for maintaining a consistent development process.

---

#### ✨ **Add Feature Prompt**

```markdown
/add-feature Add a function to decrease the counter value
```

In this workflow, Copilot follows a Spec Driven Workflow:

1. Clarification Phase:
   • Updates the changelog and asks for any necessary clarifications.
2. Test First Approach:
   • Generates a test case and ensures it fails, confirming that the test is effectively targeting the desired behavior.
3. Human Confirmation:
   • The AI pauses for a human to review and confirm the spec, ensuring alignment before proceeding.
4. Implementation Phase:
   • Implements the code, self-checks for errors, installs necessary libraries, lints, formats, and runs tests to confirm they pass.

**✅ Key Takeaways**

When you explore the prompt, please notice:

- CRITICAL PAUSE POINTS
  - Strategic pauses allow the human to verify the work in small, reviewable chunks and redirect if necessary.
- Command Explanations
  - The prompt can include specific commands or scripts, guiding the AI in self-checking, running scripts, or managing dependencies.
- Task-Specific Advice
  - The prompt is the place to add any specific guidance or notes relevant only to the particular task at hand.

#### 🚧 **Changes Review Prompt**

To run a review, simply call the prompt:

```markdown
/changes-review
```

The AI will analyze the current git diffs, then reference other files in the repo for context. It will generate a comprehensive report for you to review before committing.

#### ✅ **Focus Areas**

1. **Business Logic:**

   - Detects potential unwanted side effects or missing edge cases.

2. **Code Quality:**

   - Suggests improvements or refactor opportunities.

3. **Security & Performance:**
   - Identifies vulnerabilities or inefficiencies.

#### 📌 **Why It Matters**

- AI can handle the heavy lifting, but it's **your responsibility as the Senior** to validate the findings.
- Double-check and ensure quality – small issues now can become big problems later. 😉

---

## 📚 Learning Resources

- [Instruction and Prompt Files](https://code.visualstudio.com/docs/copilot/copilot-customization)
- [Agent Mode](https://code.visualstudio.com/docs/copilot/chat/chat-agent-mode)
- [Copilot Reference](https://code.visualstudio.com/docs/copilot/reference/copilot-vscode-features)
- [ICP Dev Docs](https://internetcomputer.org/docs)
- [Rust CDK](https://internetcomputer.org/docs/current/developer-docs/backend/rust/)
- [PicJS Doc](https://dfinity.github.io/pic-js/)
- [Vitest Testing Framework](https://vitest.dev/)

---

### 🤝 **Contributing**

We welcome contributions! If you encounter a bug, have a feature request, or want to suggest improvements, please open an issue or submit a Pull Request.

We especially welcome candidates of limits you face, consider using the **Limit Candidate Form Issue** – it helps us prioritize and address the most impactful limits effectively.

---

## 📩 Submit Your Project!

🎯 **Completed your challenge? Submit your project here:**  
📢 [Submission Form](https://forms.gle/Sgmm1y2bLXYY7mwC6)

📌 **Want to explore more challenges? Return to the index:**  
🔗 [IC Vibe Coding Bootcamp Index](https://github.com/pt-icp-hub/IC-Vibe-Coding-Bootcamp-Index)

---

**Now go build something fast, tested, and production-ready 🚀🦀**
