# Pull Request Workflow

End-to-end process for opening a pull request in this framework.

**AI agents:** start from [AGENTS.md](../../AGENTS.md) for documentation routing. For coding standards, see [CONTRIBUTING.md](../../CONTRIBUTING.md). For the agent pre-flight checklist, see [PR_SELF_REVIEW.md](./PR_SELF_REVIEW.md).

---

## Overview

```
Branch → implement → Stage 1 self-review → push → open PR (template)
```

Do **not** push or open a PR until Stage 1 self-review passes with `Gate: Ready to open PR`.

---

## Step 1 — Create a focused branch

```bash
git checkout -b feature/<short-description>
# or
git checkout -b fix/<short-description>
```

One logical change per PR (test, page object, config, or docs).

---

## Step 2 — Implement and validate locally

```bash
npx tsc --noEmit
npm test
```

Optional when debugging UI:

```bash
npm run test:headed
npm run report
```

---

## Step 3 — Stage 1 self-review (required)

Before any push or `gh pr create`, the agent (or author) must complete [PR_SELF_REVIEW.md](./PR_SELF_REVIEW.md) and post the review in chat.

**Hard gate:** If `Gate` is not `Ready to open PR`, fix blockers and re-run the self-review.

---

## Step 4 — Push the branch

```bash
git push -u origin HEAD
```

Only after Stage 1 self-review passes.

---

## Step 5 — Open the pull request

Use the GitHub UI or:

```bash
gh pr create --title "Your title" --body "$(cat <<'EOF'
## Summary
...

## Test plan
- [ ] ...

EOF
)"
```

GitHub auto-applies [.github/PULL_REQUEST_TEMPLATE.md](../../.github/PULL_REQUEST_TEMPLATE.md) when using the web UI. When using `gh pr create`, mirror the template sections in the body.

---

## Step 6 — Human review

Reviewers check:

- Scope and design fit [CONTRIBUTING.md](../../CONTRIBUTING.md)
- Tests and type-check evidence in the PR
- Documentation updates where needed
- No unintended config left in place (e.g. TEMP `slowMo` / `headless: false`)

---

## Related documents

| Document                                                                   | Role                                 |
| -------------------------------------------------------------------------- | ------------------------------------ |
| [PR_SELF_REVIEW.md](./PR_SELF_REVIEW.md)                                   | Pre-push agent checklist and Gate    |
| [.github/PULL_REQUEST_TEMPLATE.md](../../.github/PULL_REQUEST_TEMPLATE.md) | PR body structure on GitHub          |
| [CONTRIBUTING.md](../../CONTRIBUTING.md)                                   | Engineering standards                |
| [KNOWN_ISSUES.md](../../KNOWN_ISSUES.md)                                   | Repo-wide limitations to cite in PRs |
