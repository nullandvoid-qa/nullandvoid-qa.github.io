# Security Policy

## Supported Versions

Only the latest version on the `main` branch is actively maintained.

## Reporting a Vulnerability

If you discover a security vulnerability, please report it **privately**:

1. **Do not** create a public GitHub issue
2. Email: security@testersguild.com (or open a [Security Advisory](https://github.com/testersguild/testersguild.github.io/security/advisories))
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We aim to acknowledge within 48 hours and provide a fix timeline.

## Security Considerations

This is a **static website** with no backend:
- No user authentication or accounts
- No server-side processing
- No database
- All data stored in browser localStorage
- External links open in new tabs with `rel="noopener noreferrer"`

### Content Security
- No inline scripts (except `data:` URI favicon)
- External fonts from Google Fonts with `crossorigin="anonymous"`
- Discord link uses `rel="noopener noreferrer"`

### Dependencies
- No runtime dependencies (vanilla JS/CSS/HTML)
- Dev dependencies only for linting/testing
- Dependabot monitors for updates

## Scope

This policy covers:
- The main website (`testersguild.github.io`)
- All lesson content and assets
- GitHub Actions workflows

Out of scope:
- Third-party sites linked from content (labs, resources)
- Discord server security