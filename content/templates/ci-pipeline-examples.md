# CI Pipeline Examples — Test Gating

This file contains example CI snippets and guidance for running tests with sensible gating and retries.

## GitHub Actions — unit/integration/e2e split

```yaml
name: CI
on: [push, pull_request]

jobs:
  unit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:unit --silent

  integration:
    runs-on: ubuntu-latest
    needs: unit
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci
      - name: Run integration tests
        run: npm run test:integration

  e2e:
    runs-on: ubuntu-latest
    needs: integration
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci
      - name: Run E2E tests (nightly/main)
        run: npm run test:e2e
```

Notes:
- Run `unit` on every PR/commit. Fail fast there.
- `integration` can run on PRs or nightly depending on cost; require `unit` success.
- `e2e` run only on `main` or nightly builds; avoid blocking small PRs with slow E2E.
- Use artifacts to collect screenshots/logs on failures.

## Retries and Flaky Test Handling
- Implement a retry wrapper only for known transient tests, not globally.
- Prefer to mark intermittents and track them in CI metrics.

## Test parallelism and caching
- Cache dependencies between jobs to speed up runs.
- Run unit tests in parallel when supported by the runner.

## Example: publish test results and artifacts
- Upload junit/sonarqube reports to the CI UI for visibility.
- Keep failure logs and screenshots as job artifacts for debugging.
