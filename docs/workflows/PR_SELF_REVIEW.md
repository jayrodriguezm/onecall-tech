# PR Self-Review (Stage 1)

Agent-executed pre-process **before** `git push`, `gh pr create`, or opening a pull request.

**AI agents:** [AGENTS.md](../../AGENTS.md) is the documentation index; this file is the required pre-PR checklist linked from it.

For the full PR lifecycle, see [PR_WORKFLOW.md](./PR_WORKFLOW.md). For the GitHub PR body format, see [.github/PULL_REQUEST_TEMPLATE.md](../../.github/PULL_REQUEST_TEMPLATE.md).

---

## Purpose

Catch scope, quality, and validation gaps before code review. This is a **hard gate**: do not push or create a PR unless the Gate is `Ready to open PR`.

---

## When to run

Run Stage 1 self-review when:

- Implementation on a feature/fix branch is complete
- You are about to push to a remote branch
- You are about to run `gh pr create`

Re-run after addressing any blocker listed in the review.

---

## Agent execution steps

Complete these steps in order. Record findings in the Stage 1 output (below).

### 1. Gather change context

Run in parallel where possible:

```bash
git status
git diff
git log -5 --oneline
git diff main...HEAD   # or the repo's default base branch
```

Capture:

- Current branch name
- HEAD SHA (`git rev-parse --short HEAD`)
- Files changed and whether scope matches the stated goal

### 2. Scope and standards review

Verify against [CONTRIBUTING.md](../../CONTRIBUTING.md):

| Check         | Pass criteria                                                                 |
| ------------- | ----------------------------------------------------------------------------- |
| Folder layout | Page objects in `pages/`; specs in `tests/` only                              |
| Selectors     | Role/label-first; no selectors in specs                                       |
| Page objects  | Extend `BasePage`; locators private; actions public                           |
| Assertions    | In specs, not page objects                                                    |
| Waits         | No arbitrary `waitForTimeout`; dialog handling uses `Promise.all` when needed |
| Types         | No unjustified `any`; strict TypeScript                                       |
| Secrets       | No `.env`, credentials, or local editor config committed                      |
| `.gitignore`  | Generated artifacts and local-only paths excluded                             |

### 3. Run validation

```bash
npx tsc --noEmit
npm test
```

Record pass/fail and relevant output. If tests fail, Gate = **Not ready** unless failure is documented as an known external dependency in [KNOWN_ISSUES.md](../../KNOWN_ISSUES.md).

### 4. Documentation review

If the change affects structure, commands, config, or known limitations, confirm the right doc was updated:

| Change                   | Document                          |
| ------------------------ | --------------------------------- |
| Commands / setup         | `QUICK_REFERENCE.md`, `README.md` |
| Conventions              | `CONTRIBUTING.md`                 |
| Limitations / trade-offs | `KNOWN_ISSUES.md`                 |
| PR / workflow process    | `docs/workflows/`                 |

Do not duplicate content across files — link instead.

### 5. Config and TEMP flags

Inspect `playwright.config.ts` for unintended local-debug settings:

- `headless: false`
- `launchOptions.slowMo`
- Raised `timeout` solely for slowMo

These must not ship in a merge-ready PR unless the PR explicitly documents why.

### 6. Risks and follow-ups

List:

- Flaky or environment-dependent behavior
- Selectors that may be brittle
- Out-of-scope items deferred to a follow-up PR

---

## Stage 1 output format (required)

Post this in chat **before** push or PR creation. Replace placeholders with actual values.

```markdown
Stage 1 self-review @ <branch> / <sha>

## Summary

<1–2 sentences: what changed and why>

## Scope

- Files: <list or count>
- In scope: <bullets>
- Out of scope: <bullets or "none">

## Validation

- [ ] `npx tsc --noEmit` — <pass | fail + note>
- [ ] `npm test` — <pass | fail + note>

## Standards (CONTRIBUTING)

- [ ] Page objects / selectors / assertions — <pass | fail + note>
- [ ] No secrets or local-only files staged — <pass | fail + note>

## Documentation

- [ ] Updated docs if needed — <files or "not required">

## Risks / limitations

- <bullets or "none">

## Blockers

- <bullets or "none">

Gate: Ready to open PR | Not ready — <reason>
```

### Gate rules

| Gate                   | Meaning                                                            |
| ---------------------- | ------------------------------------------------------------------ |
| `Ready to open PR`     | All blockers resolved; validation passed; safe to push and open PR |
| `Not ready — <reason>` | Do **not** push or create PR until fixed and self-review re-run    |

---

## After Stage 1 passes

1. Push the branch (see [PR_WORKFLOW.md](./PR_WORKFLOW.md))
2. Open PR using [.github/PULL_REQUEST_TEMPLATE.md](../../.github/PULL_REQUEST_TEMPLATE.md)
3. Paste or summarize validation evidence in the PR **Validation Performed** section

---

## Example (minimal)

```markdown
Stage 1 self-review @ feature/rfq-test / a1b2c3d

## Summary

Add RFQ E2E test and QuoteFormPage page object for AstroFlow quote flow.

## Scope

- Files: pages/QuoteFormPage.ts, tests/requestQuote.spec.ts, playwright.config.ts
- In scope: single RFQ happy-path test
- Out of scope: cross-browser, CI workflow

## Validation

- [x] `npx tsc --noEmit` — pass
- [x] `npm test` — pass (1/1)

## Standards (CONTRIBUTING)

- [x] Page objects / selectors / assertions — pass
- [x] No secrets or local-only files staged — pass

## Documentation

- [x] Updated docs if needed — README.md, CONTRIBUTING.md

## Risks / limitations

- Live site dependency; alert-based success assertion

## Blockers

- none

Gate: Ready to open PR
```
