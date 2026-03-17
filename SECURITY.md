# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| latest (`main`) | ✅ |

## Reporting a Vulnerability

If you discover a security vulnerability in **vibe.cerberus**, please **do not** open a public GitHub issue.

Instead, report it privately:

1. Go to the [GitHub Security Advisories](https://github.com/thiendx-code-it/cerberus-vibe-hub/security/advisories/new) page
2. Click **"Report a vulnerability"**
3. Provide a clear description, reproduction steps, and potential impact

We will acknowledge your report within **48 hours** and aim to release a fix within **7 days** for critical issues.

## Scope

This policy covers security issues in:

- The hub platform code (`src/`, `scripts/`, `vite.config.ts`)
- Bundled mini-apps under `src/apps/`

## Out of Scope

- Issues in third-party dependencies (report those upstream)
- Theoretical vulnerabilities without a practical exploit

## Responsible Disclosure

We follow responsible disclosure principles. Please give us reasonable time to address the issue before public disclosure. We appreciate coordinated disclosure and will credit reporters in the fix commit unless you prefer to remain anonymous.
