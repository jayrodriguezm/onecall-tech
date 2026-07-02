# Quick Reference

> Cheat sheet for engineers onboarding to this project. For context and rationale, see [README.md](./README.md) and [CONTRIBUTING.md](./CONTRIBUTING.md).
>
> **AI agents:** start with [AGENTS.md](./AGENTS.md) — the documentation index that routes tasks to the correct file.

---

## Repository Structure

```
pages/          Page Objects
pages/base/     BasePage abstract class
tests/          Test specs (*.spec.ts)
playwright.config.ts
tsconfig.json
```

| What | Where |
|---|---|
| Page Objects | `pages/` |
| Components | `components/` *(reserved, not yet used)* |
| Tests | `tests/` |
| Reporters | `reporters/` |
| API clients | `api/` *(reserved, not yet used)* |
| Utilities | `utils/` *(reserved, not yet used)* |
| Configuration | `playwright.config.ts`, `tsconfig.json` |

---

## Setup (first time)

```bash
npm install
```

Chromium is installed automatically via `postinstall`. Fallback:

```bash
npx playwright install chromium
```

---

## Common Commands

| Command | Action |
|---|---|
| `npm test` | Run all tests (headless, default) |
| `npm run test:headed` | Run with visible browser |
| `npm run test:ui` | Playwright UI mode (pick tests, watch, time travel) |
| `npm run test:debug` | Playwright Inspector (pause, step, pick locators) |
| `npm run report` | Open last HTML report |
| `npm run typecheck` | Type-check without running tests |
| `npm run ci` | Full CI pipeline (install + verify) — same as `scripts/ci.sh` |
| `npm run ci:verify` | Type-check + tests only (deps must exist) |

---

## Smoke Execution

Single test suite today — run everything:

```bash
npm test
```

---

## Regression Execution

Not yet defined. When tags are added, run tagged suites here.

---

## Report Generation

Reports are produced automatically after each run.

```bash
npm run report           # Playwright HTML report (playwright-report/)
```

**Custom summary** (this repo): after every run, `reporters/summaryReporter.ts` writes:

| File | Format |
|---|---|
| `custom-report/summary.md` | Human-readable execution summary |
| `custom-report/summary.json` | Machine-readable results |

Open `custom-report/summary.md` in your editor, or parse `summary.json` in CI.

**CI:** Run `npm run ci` locally to simulate any CI runner. See [docs/workflows/CI.md](./docs/workflows/CI.md). GitHub Actions (`.github/workflows/e2e.yml`) is optional.

See [Debugging & failure artifacts](#debugging--failure-artifacts) for traces, screenshots, and video.

### Optional: slow-motion in config

To watch actions with a 1s pause between steps, uncomment `headless: false` and `launchOptions.slowMo` in `playwright.config.ts`. Prefer `npm run test:debug` or `npm run test:ui` for most debugging.

---

## Debugging & failure artifacts

Configured in `playwright.config.ts`. Full detail lives here; [README.md](./README.md) summarizes config values.

### Interactive debugging (while writing tests)

| Command | Tool |
|---|---|
| `npm run test:debug` | **Playwright Inspector** — pause, step line-by-line, pick locators |
| `npm run test:ui` | **UI Mode** — pick tests, watch runs, time-travel DOM |
| `npm run test:headed` | Visible browser without Inspector |

### Artifacts after a run

| Artifact | Config | When captured | Location |
|---|---|---|---|
| **Trace** | `trace: 'on-first-retry'` | When a test **retry** runs | `test-results/` (`.zip`) |
| **Screenshot** | `screenshot: 'only-on-failure'` | Test fails | `test-results/` |
| **Video** | `video: 'retain-on-failure'` | Test fails | `test-results/` |
| **HTML report** | `reporter: 'html'` | Every run | `playwright-report/` |
| **Custom summary** | `reporters/summaryReporter.ts` | Every run | `custom-report/summary.md`, `summary.json` |

### What `on-first-retry` means

Playwright records a **trace** (timeline, DOM snapshots, network, console) only when a test enters a **retry attempt** — not on a clean first-pass success.

| Run outcome | Trace saved? |
|---|---|
| Passes on first try | No |
| Fails, then retries (CI) | Yes — on the retry run |
| Passes on retry | Yes — from the retry attempt |

**Local vs CI:** `retries` is `0` locally and `2` in CI. Traces from `on-first-retry` appear mainly in **CI** or when you opt in locally:

```bash
CI=1 npm test          # enables retries → traces on retry
# or temporarily in playwright.config.ts: retries: 1, trace: 'retain-on-failure'
```

### Viewing a trace

From the HTML report (`npm run report`) — click the trace link on a failed/retried test.

Or from the command line:

```bash
npx playwright show-trace test-results/<test-folder>/trace.zip
```

Opens the **Trace Viewer**: step through each action, inspect DOM, network, and console at any point.

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| Page never loads / timeout on `goto` | Confirm the site opens in a normal browser; check network connectivity |
| `Executable doesn't exist` | Run `npx playwright install chromium` |
| `No dialog is showing` on submit | Use the `Promise.all` dialog pattern — see [CONTRIBUTING.md](./CONTRIBUTING.md) |
| Red squiggles in IDE | Reload window; ensure workspace TypeScript version matches project (`typescript` in `devDependencies`) |

---

## Adding a New Test

1. Create `tests/<name>.spec.ts`
2. Import page objects from `pages/`
3. Keep selectors out of the spec — add interactions to a page object instead

See [CONTRIBUTING.md](./CONTRIBUTING.md) for full conventions. For opening a PR, see [docs/workflows/PR_WORKFLOW.md](./docs/workflows/PR_WORKFLOW.md).
