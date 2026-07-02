# onecall-tech

End-to-end automation framework for [AstroFlow](https://astroflow.wingflows.com/), a logistics and manufacturing demo site. Built with Playwright and TypeScript using the Page Object Model.

---

## Goals

- Validate critical user journeys on AstroFlow with reliable, maintainable E2E tests.
- Establish a scalable automation structure that supports future test growth.
- Provide clear documentation so engineers and AI-assisted tools can onboard quickly.

## Scope

**In scope**

- Browser-based E2E tests against the public AstroFlow site.
- Page Object Model for UI interactions.
- A single RFQ (Request for Quote) workflow test as the initial coverage.

**Out of scope**

- API-level testing (no API client layer yet).
- Cross-browser matrix (Chromium only for now).
- CI pipeline configuration.
- Backend or form submission persistence validation.

---

## Technology Stack

| Layer | Choice |
|---|---|
| Test runner | [Playwright](https://playwright.dev/) |
| Language | TypeScript |
| Pattern | Page Object Model |
| Browser | Chromium (Desktop Chrome) |
| Reporting | HTML + list + custom summary (`custom-report/`) |

---

## Installation

**Prerequisites:** Node.js ≥ 18, npm ≥ 9

```bash
npm install
```

The `postinstall` script downloads the Chromium browser automatically. If browsers are missing, run:

```bash
npx playwright install chromium
```

**Network:** The target site must be reachable at `https://astroflow.wingflows.com`. See [KNOWN_ISSUES.md](./KNOWN_ISSUES.md) if navigation times out.

---

## Configuration

Runtime settings live in `playwright.config.ts`:

| Setting | Value | Why |
|---|---|---|
| `baseURL` | `https://astroflow.wingflows.com` | Keeps page objects URL-relative |
| `testDir` | `./tests` | Specs only; page objects stay separate |
| `retries` | 2 in CI, 0 locally | Reduces CI noise without masking local flakiness |
| `workers` | 1 in CI | Predictable execution in shared pipelines |
| `trace` | `on-first-retry` | Records a trace zip when a test is retried — see [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) → Debugging |
| `screenshot` / `video` | `only-on-failure` / `retain-on-failure` | Saved under `test-results/` when a test fails |
| `reporter` | `html`, `list`, custom summary | HTML report, console output, and `custom-report/summary.md` |
| `slowMo` / `headless` | commented out in config | Uncomment in `playwright.config.ts` for slow visual stepping |

TypeScript settings are in `tsconfig.json`.

For day-to-day commands and debugging, see [QUICK_REFERENCE.md](./QUICK_REFERENCE.md).

---

## Running the Project

```bash
npm test                 # headless run (default)
npm run test:headed      # visible browser
npm run test:ui          # Playwright UI mode
npm run test:debug       # Playwright Inspector (step-through)
npm run report           # open HTML report
npx tsc --noEmit         # type-check only
```

---

## Folder Structure

```
onecall-tech/
├── AGENTS.md               # Documentation index for AI agents
├── playwright.config.ts
├── tsconfig.json
├── package.json
├── .github/
│   └── PULL_REQUEST_TEMPLATE.md
├── docs/
│   └── workflows/
│       ├── PR_WORKFLOW.md
│       └── PR_SELF_REVIEW.md
├── reporters/
│   └── summaryReporter.ts  # Custom post-run summary (JSON + Markdown)
├── pages/                  # Page Objects (not tests)
│   ├── base/
│   │   └── BasePage.ts
│   ├── HomePage.ts
│   └── QuoteFormPage.ts
└── tests/                  # Test specs only
    └── requestQuote.spec.ts
```

Reserved for future growth (not yet present): `components/`, `api/`, `utils/`.

---

## Architecture Overview

```
┌─────────────┐     uses      ┌──────────────────┐
│  Test Spec  │ ────────────► │   Page Objects   │
│  (tests/)   │               │    (pages/)      │
└─────────────┘               └────────┬─────────┘
                                       │ extends
                                       ▼
                              ┌──────────────────┐
                              │     BasePage     │
                              │  open(), getUrl()│
                              └──────────────────┘
```

- **Tests** orchestrate user flows and assertions. They should not contain selectors.
- **Page Objects** encapsulate locators and interactions.
- **BasePage** enforces a shared navigation contract (`getUrl()`, `open()`).

Implementation standards are defined in [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## Design Decisions

| Decision | Rationale |
|---|---|
| Page objects at repo root (`pages/`) | Separates reusable UI code from executable tests; mirrors common Python/pytest layouts |
| Role/label-first selectors | Resilient to DOM structure changes; aligns with accessibility best practices |
| Typed fill helpers on `QuoteFormPage` | Groups form sections logically and keeps specs readable |
| Dialog handled via `Promise.all` | Asserts and accepts the alert in the same tick as submit; required when `slowMo` is enabled |
| `goto` waits for `domcontentloaded` | Avoids hanging on slow third-party assets during navigation |
| Chromium only | Sufficient for current scope; reduces install and maintenance overhead |

---

## Testing Strategy

| Type | Status | Location |
|---|---|---|
| E2E – RFQ submission | Implemented | `tests/requestQuote.spec.ts` |
| Smoke | Same as current suite (single test) | — |
| Regression | Not yet defined | — |

The current test covers:

1. Navigate to the homepage
2. Click **Request a Quote**
3. Fill all required RFQ fields
4. Submit the form
5. Assert the success dialog message

---

## Assumptions

- AstroFlow remains publicly accessible at `https://astroflow.wingflows.com`.
- The RFQ form continues to show a browser alert on successful submission.
- Form field labels and IDs match the open-source [AstroFlow template](https://github.com/sudeep2003/AstroFlow).
- No authentication is required for the tested flow.

---

## Future Improvements

- Add `components/` for shared UI fragments reused across pages.
- Add `utils/` for test data builders and helpers.
- Expand browser coverage (Firefox, WebKit).
- Tag tests for smoke vs. regression execution.
- Add CI workflow with artifact upload (reports, traces).
- Replace browser `alert()` assertion with a DOM-based success state if the app changes.

---

## Related Documentation

| Document | Purpose |
|---|---|
| [AGENTS.md](./AGENTS.md) | **Documentation index for AI agents** — task → doc routing |
| [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) | Cheat sheet for common tasks |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Engineering and coding standards |
| [KNOWN_ISSUES.md](./KNOWN_ISSUES.md) | Limitations and trade-offs |
| [docs/workflows/PR_WORKFLOW.md](./docs/workflows/PR_WORKFLOW.md) | Pull request lifecycle |
| [docs/workflows/PR_SELF_REVIEW.md](./docs/workflows/PR_SELF_REVIEW.md) | Stage 1 self-review (agent pre-process) |
| [.github/PULL_REQUEST_TEMPLATE.md](./.github/PULL_REQUEST_TEMPLATE.md) | GitHub PR body template |
