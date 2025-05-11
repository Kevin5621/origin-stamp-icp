---
mode: "agent"
tools: ["changes", "codebase", "usages", "terminalLastCommand"]
description: "Perform a current changes review"
---

## Add Feature Instructions

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
