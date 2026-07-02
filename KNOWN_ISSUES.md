# Known Issues

Documented limitations and intentional trade-offs for this framework. This is **not** a bug tracker — use GitHub Issues for defects.

---

## Current Limitations

### Single browser project (Chromium only)

Only Chromium is configured in `playwright.config.ts`. Firefox and WebKit are not installed or tested.

**Why:** Keeps setup minimal for the current single-test scope. Cross-browser coverage can be added when the suite grows.

### Single test, no tagging

The suite contains one E2E test with no `@smoke` or `@regression` tags.

**Why:** Tagging adds value once multiple tests exist. Smoke and regression are currently equivalent.

### No CI pipeline

Tests run locally only. No GitHub Actions workflow is configured.

**Why:** Out of scope for initial bootstrap. CI should be added before team-scale usage.

### External site dependency

All tests target the live site at `https://astroflow.wingflows.com`.

**Why:** This is a demo/exercise target, not a controlled test environment. Tests depend on site availability and unchanged UI.

### Optional slow-motion config (commented out)

`playwright.config.ts` includes commented `slowMo` / `headless` settings for local visual stepping. They are **off by default** — use `npm run test:debug` or `npm run test:ui` instead.

**Why:** Keeps default runs fast and headless; slowMo remains available without being active.

### Success assertion via browser alert

The RFQ form shows success through a JavaScript `alert()` dialog, not a DOM element.

**Why:** Matches the upstream [AstroFlow template](https://github.com/sudeep2003/AstroFlow) behavior. Handle the dialog with `Promise.all` alongside the submit action — see [CONTRIBUTING.md](./CONTRIBUTING.md).

### Reserved folders not yet created

`components/`, `api/`, and `utils/` are documented as future locations but do not exist yet.

**Why:** YAGNI — the current single test does not require shared components, API clients, or utilities.

---

## Technical Debt

| Item | Notes |
|---|---|
| `#industry` / `#timeline` ID selectors | Used where Radix UI `<select>` elements lack stable accessible names. Prefer role/label if the app improves accessibility. |
| Hard-coded test data in spec | Acceptable for one test; should move to a builder in `utils/` as coverage grows. |
| No test data cleanup | Form submission is client-side only (console log + alert). No backend state to reset. |

---

## Deferred Improvements

- Cross-browser matrix (Firefox, WebKit)
- Test tagging for smoke vs. regression
- CI workflow with report artifacts
- Test data factories in `utils/`
- DOM-based success assertion if the application replaces `alert()`

---

## External Dependencies

| Dependency | Impact |
|---|---|
| `https://astroflow.wingflows.com` | Tests fail if the site is down or unreachable |
| AstroFlow open-source template | Form field IDs and labels assumed stable |

---

## Exercise Constraints

This repository was bootstrapped as a focused automation exercise:

- One user journey (Request a Quote)
- Page Object Model with a base class
- TypeScript + Playwright

Scope was intentionally limited to demonstrate structure and documentation maturity, not full product coverage.

---

## Design Trade-offs

| Trade-off | Chosen | Alternative | Reason |
|---|---|---|---|
| Page objects location | `pages/` at repo root | Inside `tests/` | Clear separation of tests vs. reusable UI code |
| Retries | 0 local, 2 in CI | Always retry | Expose flakiness locally; tolerate transient CI failures |
| Parallel workers | Default local, 1 in CI | Always parallel | Predictable CI runs for now |
| Dialog vs. DOM assertion | Dialog listener | Visible success banner | Matches actual app behavior today |
