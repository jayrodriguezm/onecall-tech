# AGENTS.md

**Documentation index for AI agents.**

This is the single routing document for agent tooling (Cursor, Copilot, etc.). It maps **intent → canonical doc** so agents open the right file instead of searching the repo or duplicating content.

Humans: start with [README.md](./README.md). This file is optimized for agents.

---

## How to use this index

1. Identify the task you are performing (see table below).
2. Open **only** the linked document for that task.
3. Do not duplicate standards here — follow the linked doc.
4. Before push or PR creation, always complete [docs/workflows/PR_SELF_REVIEW.md](./docs/workflows/PR_SELF_REVIEW.md).

---

## Task → document routing

| Task | Read |
|---|---|
| Understand the project | [README.md](./README.md) |
| Run tests or common commands | [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) |
| Debug a failed test or inspect traces | [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) → Debugging & failure artifacts |
| Add or change a test spec | [CONTRIBUTING.md](./CONTRIBUTING.md) → Test organization, Assertion strategy |
| Add or change a page object | [CONTRIBUTING.md](./CONTRIBUTING.md) → Page Object standards, Selector strategy |
| Change Playwright / TypeScript config | [README.md](./README.md) → Configuration; [KNOWN_ISSUES.md](./KNOWN_ISSUES.md) for trade-offs |
| Open or prepare a pull request | [docs/workflows/PR_WORKFLOW.md](./docs/workflows/PR_WORKFLOW.md) |
| Pre-push / pre-PR self-review (required) | [docs/workflows/PR_SELF_REVIEW.md](./docs/workflows/PR_SELF_REVIEW.md) |
| Fill in the GitHub PR body | [.github/PULL_REQUEST_TEMPLATE.md](./.github/PULL_REQUEST_TEMPLATE.md) |
| Check known limitations | [KNOWN_ISSUES.md](./KNOWN_ISSUES.md) |
| Coding standards (selectors, waits, naming) | [CONTRIBUTING.md](./CONTRIBUTING.md) |

---

## Hard gates (agents)

| Action | Requirement |
|---|---|
| `git push` to a PR branch | Stage 1 self-review posted; `Gate: Ready to open PR` |
| `gh pr create` | Same as above — never open a PR before self-review |

See [docs/workflows/PR_SELF_REVIEW.md](./docs/workflows/PR_SELF_REVIEW.md) for the required output format.

---

## Repository layout (quick)

| Path | Purpose |
|---|---|
| `pages/` | Page Objects — not tests |
| `pages/base/BasePage.ts` | Shared navigation contract |
| `tests/` | Test specs only |
| `playwright.config.ts` | Playwright runtime config |
| `reporters/` | Custom Playwright reporters |
| `docs/workflows/` | PR lifecycle and self-review |

---

## Validation before finishing work

```bash
npx tsc --noEmit
npm test
```

---

## Document responsibilities (do not duplicate)

| Document | Answers |
|---|---|
| [README.md](./README.md) | What is this project? |
| [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) | How do I run things quickly? How do traces and debugging work? |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | How should I implement changes? |
| [KNOWN_ISSUES.md](./KNOWN_ISSUES.md) | What limitations exist? |
| **AGENTS.md** (this file) | **Which doc should I read for my task?** |
| [docs/workflows/PR_WORKFLOW.md](./docs/workflows/PR_WORKFLOW.md) | What is the PR lifecycle? |
| [docs/workflows/PR_SELF_REVIEW.md](./docs/workflows/PR_SELF_REVIEW.md) | What checks run before a PR? |
