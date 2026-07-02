# Contributing

Engineering standards for extending and maintaining this automation framework.

For project overview, see [README.md](./README.md). For quick commands, see [QUICK_REFERENCE.md](./QUICK_REFERENCE.md).

**AI agents:** use [AGENTS.md](./AGENTS.md) as the documentation index — it routes tasks to the correct doc. Do not treat this file or README as a substitute for that index.

---

## Repository Conventions

- **Tests** live in `tests/` and must not contain selectors or low-level locator logic.
- **Page Objects** live in `pages/` and encapsulate all UI interaction for a page or flow.
- **Shared base behavior** lives in `pages/base/BasePage.ts`.
- **Fixtures** live in `fixtures/` and inject page objects via Playwright's `test.extend`.
- **Test data** lives in `utils/` (builders, constants) — not inline in specs.
- Avoid duplicating documentation — link between docs instead.

---

## Folder Conventions

| Folder        | Responsibility                                   |
| ------------- | ------------------------------------------------ |
| `pages/`      | Page Object classes                              |
| `pages/base/` | Abstract base classes                            |
| `tests/`      | Executable test specs                            |
| `reporters/`  | Custom Playwright reporters                      |
| `components/` | Reusable UI fragments _(future)_                 |
| `api/`        | API clients _(future)_                           |
| `fixtures/`   | Playwright test fixtures (page object injection) |
| `config/`     | Environment and shared configuration             |
| `utils/`      | Helpers, builders, shared utilities              |

Do not place page objects inside `tests/`.

---

## Naming Conventions

| Artifact            | Convention                            | Example                                                 |
| ------------------- | ------------------------------------- | ------------------------------------------------------- |
| Page Object file    | PascalCase, suffix implied            | `HomePage.ts`                                           |
| Page Object class   | PascalCase                            | `QuoteFormPage`                                         |
| Test spec file      | camelCase + `.spec.ts`                | `requestQuote.spec.ts`                                  |
| Test describe block | Feature area                          | `'Request a Quote'`                                     |
| Test title          | Behavior-focused                      | `'should submit the RFQ form and show success message'` |
| Private locators    | camelCase methods returning `Locator` | `firstNameInput()`                                      |
| Public actions      | verb-first async methods              | `fillContactInfo()`, `clickRequestAQuote()`             |

---

## Branch Strategy

- `master` — stable, passing tests
- Feature branches — `feature/<short-description>` or `fix/<short-description>`
- Keep branches focused on a single change

---

## Commit Messages

Use clear, imperative sentences focused on **why**:

```
Add QuoteFormPage fill helpers for service requirements

Extract industry select into page object to keep spec selector-free.
```

Avoid vague messages like `fix stuff` or `update tests`.

---

## Pull Request Expectations

Follow [docs/workflows/PR_WORKFLOW.md](./docs/workflows/PR_WORKFLOW.md):

1. Complete [Stage 1 self-review](./docs/workflows/PR_SELF_REVIEW.md) before push or PR creation
2. Use the [PR template](.github/PULL_REQUEST_TEMPLATE.md) when opening the PR

Every PR should include:

- Summary of the change
- Stage 1 self-review evidence (branch, SHA, Gate)
- Validation performed (local test run, type-check)
- Known limitations or follow-ups

---

## Coding Standards

- TypeScript strict mode is enabled — no `any` without justification.
- Prefer explicit types for page object method parameters (see `QuoteContactInfo`).
- One class per file for page objects.
- Keep methods small and focused on a single user action or assertion group.

---

## Page Object Standards

- Extend `BasePage` for every page object.
- Implement `getUrl()` for navigable pages.
- Keep locators **private**; expose **public** action methods only.
- Group related locators with section comments.
- Do not assert in page objects — assertions belong in specs (except waiting for navigation/state as part of an action).

Example structure:

```typescript
export class ExamplePage extends BasePage {
  getUrl(): string {
    return '/example';
  }

  private submitButton() {
    return this.page.getByRole('button', { name: /submit/i });
  }

  async submit(): Promise<void> {
    await this.submitButton().click();
  }
}
```

---

## Component Standards

_(Reserved for future use.)_

When `components/` is introduced, components should represent reusable UI fragments (modals, nav bars, form sections) shared across multiple page objects.

---

## Test Organization

- One spec file per feature or user journey.
- Use `test.describe()` to group related scenarios.
- Import `test` and `expect` from `fixtures/` (not `@playwright/test` directly) so page objects are injected.
- Tag tests with `@smoke` and/or `@regression` using Playwright's `{ tag: [...] }` option.
- Specs should read like a user story: arrange → act → assert.
- Step comments are acceptable for multi-step flows but should not replace readable method names.

Example:

```typescript
import { test, expect } from '../fixtures';
import { buildQuoteFormData } from '../utils/quoteTestData';

test(
  'should submit RFQ',
  { tag: ['@smoke', '@regression'] },
  async ({ homePage, quoteFormPage }) => {
    const formData = buildQuoteFormData();
    // ...
  },
);
```

---

## Selector Strategy

Priority order:

1. **`getByRole`** with accessible name — preferred
2. **`getByLabel`** — for form fields
3. **`getByText`** — for visible content assertions
4. **`locator('#id')`** — only when role/label is unavailable (e.g. Radix checkbox IDs)

Avoid:

- CSS class selectors tied to styling
- XPath
- Deeply nested DOM chains

---

## Explicit Wait Strategy

- Rely on Playwright auto-waiting for actions (`click`, `fill`, `selectOption`).
- Use `waitUntil: 'domcontentloaded'` on navigation (see `BasePage.open()`).
- Use `waitForLoadState('domcontentloaded')` after in-page navigation when needed.
- Avoid hard-coded `page.waitForTimeout()`.

---

## Assertion Strategy

- Assertions live in test specs, not page objects.
- Prefer `expect()` with Playwright matchers: `toHaveURL`, `toBeVisible`, `toContainText`.
- For browser `alert()` dialogs, use `Promise.all` to handle the dialog in the same tick as the triggering action — especially when `slowMo` is enabled:

```typescript
await Promise.all([
  page.waitForEvent('dialog').then(async (dialog) => {
    expect(dialog.message()).toContain('Thank you for your request!');
    await dialog.accept();
  }),
  quoteFormPage.submitForm(),
]);
```

Registering the listener separately and calling `accept()` later can fail when `slowMo` delays the handler.

---

## Error Handling Expectations

- Do not wrap every action in try/catch — let Playwright surface failures with full context.
- Use meaningful test data so failures are diagnosable from the report.
- On failure, rely on configured screenshots, video, and traces — see [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) → Debugging & failure artifacts.

---

## Logging Expectations

This repo is scoped as a **pure UI automation framework** — browser E2E tests and page objects only. There is no `api/` layer, no backend contract validation, and no shared non-Playwright libraries that need their own log stream.

For that reason, **we do not add a custom logging framework** (Winston, Pino, etc.). Playwright already provides the observability UI tests need:

| Need                      | Use instead                                                     |
| ------------------------- | --------------------------------------------------------------- |
| Pass/fail and step output | `list` reporter                                                 |
| Post-run review           | HTML report (`npm run report`)                                  |
| Custom execution summary  | `custom-report/summary.md` (see `reporters/summaryReporter.ts`) |
| Step-by-step replay       | Trace (`on-first-retry` in CI)                                  |
| Failure evidence          | Screenshot and video (see `playwright.config.ts`)               |

See [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) → Debugging & failure artifacts for details.

**Rules:**

- Do not introduce a logging library or wrapper unless the repo gains non-UI code paths (e.g. API clients in `api/`) that cannot use Playwright reporters.
- Use Playwright's built-in reporters for normal output.
- Add `console.log` only for temporary local debugging — remove before merging.

If API-level testing is added later, revisit this section and define logging for that layer separately from Playwright's test reporting.

---

## AI-Assisted Development Expectations

When using AI tools to extend this framework:

- Start from [AGENTS.md](./AGENTS.md) to find the right documentation for your task.
- Follow existing folder and naming conventions.
- Do not move page objects into `tests/`.
- Do not duplicate content across documentation files.
- Run `npx tsc --noEmit` and `npm test` before considering work complete.
- Complete [Stage 1 self-review](./docs/workflows/PR_SELF_REVIEW.md) before push or PR creation.
- Reference [KNOWN_ISSUES.md](./KNOWN_ISSUES.md) for intentional limitations.

---

## Documentation Expectations

Update documentation when you:

- Add a new folder or architectural layer
- Change configuration defaults
- Introduce a known limitation or workaround
- Add new npm scripts

| Change type            | Update                                                                                                     |
| ---------------------- | ---------------------------------------------------------------------------------------------------------- |
| New command or script  | `QUICK_REFERENCE.md`, `README.md`                                                                          |
| CI workflow change     | `scripts/ci.sh`, [docs/workflows/CI.md](./docs/workflows/CI.md), `QUICK_REFERENCE.md`, `eslint.config.mjs` |
| New convention         | `CONTRIBUTING.md`                                                                                          |
| New limitation         | `KNOWN_ISSUES.md`                                                                                          |
| New doc or workflow    | `AGENTS.md` task routing table                                                                             |
| Custom reporter change | `QUICK_REFERENCE.md`, `README.md` configuration                                                            |
| Structural change      | `README.md` folder structure section                                                                       |
