# Quick Reference

> Cheat sheet for engineers onboarding to this project. For context and rationale, see [README.md](./README.md) and [CONTRIBUTING.md](./CONTRIBUTING.md).
>
> **AI agents:** start with [AGENTS.md](./AGENTS.md) — the documentation index that routes tasks to the correct file.

---

## Repository Structure

```
pages/          Page Objects
pages/base/     BasePage abstract class
fixtures/       Playwright fixtures (page object injection)
utils/          Test data builders and helpers
config/         Environment configuration (BASE_URL)
tests/          Test specs (*.spec.ts)
playwright.config.ts
tsconfig.json
```

| What          | Where                                           |
| ------------- | ----------------------------------------------- |
| Page Objects  | `pages/`                                        |
| Fixtures      | `fixtures/`                                     |
| Test data     | `utils/`                                        |
| Components    | `components/` _(reserved, not yet used)_        |
| Tests         | `tests/`                                        |
| Reporters     | `reporters/`                                    |
| API clients   | `api/` _(reserved, not yet used)_               |
| Configuration | `playwright.config.ts`, `config/env.ts`, `.env` |

---

## Setup (first time)

```bash
npm install
cp .env.example .env   # optional — override BASE_URL
```

Chromium is installed automatically via `postinstall`. Fallback:

```bash
npx playwright install chromium
```

---

## Common Commands

| Command                   | Action                                                        |
| ------------------------- | ------------------------------------------------------------- |
| `npm test`                | Run all tests (headless, default)                             |
| `npm run test:smoke`      | Run tests tagged `@smoke`                                     |
| `npm run test:regression` | Run tests tagged `@regression`                                |
| `npm run test:headed`     | Run with visible browser                                      |
| `npm run test:ui`         | Playwright UI mode (pick tests, watch, time travel)           |
| `npm run test:debug`      | Playwright Inspector (pause, step, pick locators)             |
| `npm run report`          | Open last HTML report                                         |
| `npm run lint`            | ESLint                                                        |
| `npm run format`          | Prettier (write)                                              |
| `npm run format:check`    | Prettier (check only)                                         |
| `npm run typecheck`       | Type-check without running tests                              |
| `npm run ci`              | Full CI pipeline (install + verify) — same as `scripts/ci.sh` |
| `npm run ci:verify`       | Lint, format, typecheck, tests (deps must exist)              |

---

## Smoke Execution

```bash
npm run test:smoke
```

---

## Regression Execution

```bash
npm run test:regression
```

---

## Report Generation

Reports are produced automatically after each run.

```bash
npm run report           # Playwright HTML report (playwright-report/)
```

**Custom summary** (this repo): after every run, `reporters/summaryReporter.ts` writes:

| File                         | Format                           |
| ---------------------------- | -------------------------------- |
| `custom-report/summary.md`   | Human-readable execution summary |
| `custom-report/summary.json` | Machine-readable results         |

Open `custom-report/summary.md` in your editor, or parse `summary.json` in CI.

**CI:** Run `npm run ci` locally to simulate any CI runner. See [docs/workflows/CI.md](./docs/workflows/CI.md). GitHub Actions (`.github/workflows/e2e.yml`) is optional.

See [Debugging & failure artifacts](#debugging--failure-artifacts) for traces, screenshots, and video.

### Optional: slow-motion in config

To watch actions with a 1s pause between steps, uncomment `headless: false` and `launchOptions.slowMo` in `playwright.config.ts`. Prefer `npm run test:debug` or `npm run test:ui` for most debugging.

---

## Environment Variables

Copy `.env.example` to `.env` and adjust as needed:

| Variable   | Default                           | Purpose                |
| ---------- | --------------------------------- | ---------------------- |
| `BASE_URL` | `https://astroflow.wingflows.com` | Application under test |

Playwright loads `.env` automatically. A pre-flight health check in `global-setup.ts` runs before tests.

---

## Debugging & failure artifacts

When a test fails, Playwright saves artifacts under `test-results/`:

| Artifact   | When              | Location                                     |
| ---------- | ----------------- | -------------------------------------------- |
| Screenshot | Test failure      | `test-results/<test-name>/test-failed-*.png` |
| Video      | Test failure      | `test-results/<test-name>/video.webm`        |
| Trace      | First retry in CI | `test-results/<test-name>/trace.zip`         |

Open a trace:

```bash
npx playwright show-trace test-results/<path-to-trace.zip>
```

**Local retries:** `retries: 0` locally — traces appear mainly in CI (`on-first-retry`).

---

## Adding a New Test

1. Create `tests/<feature>.spec.ts`
2. Import `test`, `expect` from `../fixtures`
3. Use injected fixtures (`homePage`, `quoteFormPage`) or add new fixtures in `fixtures/index.ts`
4. Tag with `@smoke` and/or `@regression` as appropriate
5. Use `buildQuoteFormData()` or add builders in `utils/`
6. Run `npm run lint && npm run typecheck && npm test`

See [CONTRIBUTING.md](./CONTRIBUTING.md) for full standards.

---

## Adding a Page Object

1. Create `pages/<Name>Page.ts` extending `BasePage`
2. Implement `getUrl()` if the page is directly navigable
3. Keep locators private; expose public action methods
4. Register in `fixtures/index.ts` if used across multiple specs

---

## Type-Checking

```bash
npm run typecheck
```

---

## Related Docs

| Doc                                            | Use when         |
| ---------------------------------------------- | ---------------- |
| [README.md](./README.md)                       | Project overview |
| [CONTRIBUTING.md](./CONTRIBUTING.md)           | Coding standards |
| [KNOWN_ISSUES.md](./KNOWN_ISSUES.md)           | Limitations      |
| [docs/workflows/CI.md](./docs/workflows/CI.md) | CI pipeline      |
