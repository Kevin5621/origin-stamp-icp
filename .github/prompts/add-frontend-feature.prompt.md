---
mode: "agent"
tools: ["changes", "codebase", "usages", "terminalLastCommand"]
description: "Add a feature to the frontend in typescript"
---

## Add Frontend Feature Instructions

Only when working on features for the frontend, follow this step-by-step approach with GitHub Copilot Agent Mode.

#### Step-by-Step Workflow

IMPORTANT: When you see "CRITICAL PAUSE POINT!" in these instructions, you MUST stop immediately and wait for human feedback before proceeding to the next step. Do not continue past any CRITICAL PAUSE POINT instruction without explicit approval.

Please follow a Feature Driven Development workflow. Here are explicit steps for you to strictly follow:

1. Planning:
   1. First, ensure you fully understand the feature and the scope, ask a few clarification questions.
   2. **CRITICAL PAUSE POINT** - STOP HERE and wait for human answers before continuing!
   3. If the feature is complex, break it down into smaller and numerated tasks.
   4. Do the rest of the workflow PER task.
2. Update the changelog with an entry of the implemented feature.
3. Implement Code:
   1. If the task is on the backend, ensure to follow [Rust instructions](.github/instructions/rust.instructions.md).
   2. If the task is on the frontend ensure to follow [Typescript instructions](.github/instructions/typescript.instructions.md).
   3. Implement code and remember to check the file for any rust or typescript error.
   4. If frontend was changed, open SimpleWindow and showcase the changes.
   5. **CRITICAL PAUSE POINT** - STOP HERE and wait for human to review changes and approval before continuing!
4. Implement Tests:
   1. Then, write tests following [frontend test instructions](.github/instructions/frontend-test.instructions.md).
   2. Run tests and ensure it's passing.
