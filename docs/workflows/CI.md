# CI Pipeline

Platform-agnostic continuous integration for this framework.

The **CI contract** lives in one place: [`scripts/ci.sh`](../scripts/ci.sh). Any CI system should call that script (or the equivalent npm scripts). Provider-specific YAML is optional glue.

For GitHub Actions, see [`.github/workflows/e2e.yml`](../.github/workflows/e2e.yml) as one example adapter.

---

## CI contract

| Phase             | Command                 | Purpose                                                    |
| ----------------- | ----------------------- | ---------------------------------------------------------- |
| **Install**       | `scripts/ci.sh install` | `npm ci` + Playwright Chromium with OS deps                |
| **Verify**        | `scripts/ci.sh verify`  | `npm run lint` + `format:check` + `typecheck` + `npm test` |
| **Full pipeline** | `scripts/ci.sh`         | Install + verify (default)                                 |

Equivalent npm scripts:

```bash
npm run ci              # full pipeline
npm run ci:install      # install phase only
npm run ci:verify       # verify phase only
```

Set `CI=true` in your environment (most CI runners do this automatically). It enables retries and worker settings in `playwright.config.ts`.

Optional environment variables (see `.env.example`):

| Variable   | Default                           | Purpose                |
| ---------- | --------------------------------- | ---------------------- |
| `BASE_URL` | `https://astroflow.wingflows.com` | Application under test |

A pre-flight health check in `global-setup.ts` runs before tests and fails fast if the target site is unreachable.

---

## Local CI simulation

Run the same pipeline locally:

```bash
npm run ci
```

Or step by step:

```bash
npm run ci:install
npm run ci:verify
```

---

## Output artifacts

After a run, these paths are produced (upload in your CI system as needed):

| Path                         | Contents                                |
| ---------------------------- | --------------------------------------- |
| `playwright-report/`         | Playwright HTML report                  |
| `custom-report/summary.md`   | Custom Markdown summary                 |
| `custom-report/summary.json` | Custom JSON summary                     |
| `test-results/`              | Screenshots, video, traces (on failure) |

---

## Wiring into CI systems

### Any shell-based runner

```bash
checkout repo
bash scripts/ci.sh
# upload playwright-report/, custom-report/, test-results/ as artifacts
```

### GitHub Actions (included)

Optional adapter: `.github/workflows/e2e.yml` — checkout, Node setup, `scripts/ci.sh`, artifact upload.

### GitLab CI (example)

```yaml
e2e:
  image: node:20
  script:
    - bash scripts/ci.sh
  artifacts:
    when: always
    paths:
      - playwright-report/
      - custom-report/
      - test-results/
```

### Jenkins (example)

```groovy
stage('E2E') {
  steps {
    sh 'bash scripts/ci.sh'
  }
  post {
    always {
      archiveArtifacts artifacts: 'playwright-report/**, custom-report/**', allowEmptyArchive: true
    }
  }
}
```

---

## Extending the pipeline

Add new checks to `scripts/ci.sh` (or new npm scripts called from it) — not inside provider YAML. Keep adapters thin so switching CI platforms does not change the test pipeline.

Possible future extensions:

- Browser matrix (parameterize browser in `ci.sh`)
- Scheduled / nightly runs (provider config only)
- PR report comments (provider config only)

---

## Related docs

| Document                                        | Purpose                                        |
| ----------------------------------------------- | ---------------------------------------------- |
| [QUICK_REFERENCE.md](../QUICK_REFERENCE.md)     | Local commands and debugging                   |
| [KNOWN_ISSUES.md](../KNOWN_ISSUES.md)           | CI limitations and trade-offs                  |
| [playwright.config.ts](../playwright.config.ts) | `retries`, `workers`, reporters when `CI=true` |
