## Summary

<!-- What does this PR change and why? -->

---

## Stage 1 Self-Review

- [ ] [PR_SELF_REVIEW.md](../docs/workflows/PR_SELF_REVIEW.md) completed before push
- [ ] Gate was `Ready to open PR` (paste header: `Stage 1 self-review @ <branch> / <sha>`)

---

## Type of Change

- [ ] New test coverage
- [ ] Page Object update
- [ ] Framework / configuration change
- [ ] Documentation update
- [ ] Bug fix
- [ ] Refactor (no behavior change)

---

## Design Considerations

<!-- Architectural choices, selector strategy, wait strategy, or trade-offs made -->

---

## Validation Performed

- [ ] `npm test` passes locally
- [ ] `npx tsc --noEmit` passes
- [ ] Reviewed Playwright HTML report (if applicable)
- [ ] Manually verified in headed mode (if UI behavior changed)
- [ ] No TEMP debug flags left in `playwright.config.ts` (`slowMo`, `headless: false`, raised timeout)

**Commands run:**

```
<!-- paste commands and results -->
```

---

## Risks

<!-- What could break? Flaky selectors, environment assumptions, etc. -->

---

## Known Limitations

<!-- Anything intentionally out of scope for this PR? See KNOWN_ISSUES.md for repo-wide limitations. -->

---

## Checklist

- [ ] Coding standards followed ([CONTRIBUTING.md](../CONTRIBUTING.md))
- [ ] Selectors use role/label-first strategy
- [ ] No selectors added directly in test specs
- [ ] Explicit waits used appropriately (no arbitrary timeouts)
- [ ] Assertions are in specs, not page objects
- [ ] Documentation updated (README, QUICK_REFERENCE, CONTRIBUTING, or KNOWN_ISSUES as needed)
- [ ] Ready for review
