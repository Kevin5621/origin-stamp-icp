---
mode: "agent"
tools: ["changes", "codebase", "usages", "terminalLastCommand"]
description: "Add a feature to the frontend in typescript"
---

## Add Frontend Feature Instructions

Only when working on features for the frontend, follow this step-by-step approach with GitHub Copilot Agent Mode.

#### Step-by-Step Workflow

IMPORTANT: When you see "CRITICAL PAUSE POINT!" in these instructions, you MUST stop immediately and wait for human feedback before proceeding to the next step. Do not continue past any CRITICAL PAUSE POINT instruction without explicit approval.

Please follow a Spec Driven Development workflow. Here are explicit steps for you to strictly follow:

1.  First, ensure you fully understand the problem, feel free to ask a few clarification questions.
2.  **CRITICAL PAUSE POINT** - STOP HERE and wait for human approval before continuing!
3.  Update the changelog with the requested feature.
4.  Then, write tests in the frontend, especially integration tests between the frontend and backend.
5.  Also implement important edge cases that you feel are worth testing.
6.  Then check the file for any typescript error.
7.  Then run tests and ensure it's failing. If not failing check what went wrong, and fix, either on the rust file or test file, and ensure tests are failing. If they don't fail, you aren't testing anything.
8.  **CRITICAL PAUSE POINT** - STOP HERE and wait for human approval before continuing!
9.  Then, implement code changes according to the tests described. If needed, create a new component.
10. Finally, run tests and ensure it's passing.
