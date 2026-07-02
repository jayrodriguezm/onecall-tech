#!/usr/bin/env bash
# Platform-agnostic CI entry point for this framework.
# Use from any CI system (GitHub Actions, GitLab CI, Jenkins, CircleCI, local).
#
# Usage:
#   scripts/ci.sh          # install + verify (default)
#   scripts/ci.sh install  # dependencies + Playwright browsers only
#   scripts/ci.sh verify   # typecheck + E2E tests only (deps must exist)

set -euo pipefail

export CI="${CI:-true}"

install() {
  npm ci
  npx playwright install chromium --with-deps
}

verify() {
  npm run lint
  npm run format:check
  npm run typecheck
  npm test
}

case "${1:-all}" in
  install)
    install
    ;;
  verify)
    verify
    ;;
  all)
    install
    verify
    ;;
  *)
    echo "Usage: $0 [install|verify|all]" >&2
    exit 1
    ;;
esac
