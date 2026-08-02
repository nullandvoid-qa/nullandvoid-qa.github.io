---
title: Contract Test Template
---

# Contract Test Template

## Purpose
- Define the consumer-provider contract in a machine-readable format.
- Enable consumer-driven verification in CI so providers can validate compatibility.

## Metadata
- Consumer: <consumer-name>
- Provider: <provider-name>
- API version: <semver>

## Example (Pact JSON snippet)
```json
{
  "consumer": { "name": "consumer-example" },
  "provider": { "name": "provider-example" },
  "interactions": [
    {
      "description": "get user by id",
      "request": {
        "method": "GET",
        "path": "/api/users/123",
        "headers": { "Accept": "application/json" }
      },
      "response": {
        "status": 200,
        "headers": { "Content-Type": "application/json" },
        "body": { "id": 123, "name": "Alice" }
      }
    }
  ]
}
```

## How to run (consumer side)
1. Write consumer tests using a Pact library (e.g., `@pact-foundation/pact` for Node).
2. Publish the generated pact files to your pact broker or CI artifact storage.
3. Run provider verification in CI against the published pact file.

## Acceptance Criteria
- Contracts are versioned and discoverable in the broker or repo.
- Provider CI validates the current contract on every merge to `main`.
- Breaking changes require an explicit provider bump and release.

## Notes
- Use example fixtures and lightweight mock servers for local development.
- Prefer consumer-driven contracts for public APIs the product owns; for third-party APIs prefer contract tests backed by contract-first or integration tests.
