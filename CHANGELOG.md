# Changelog

## 1.1.0 - Engineering beta

- Reframed the repository as a focused AES-256-GCM envelope library.
- Replaced unsupported “military grade” product wording with `AesGcmEnvelope`; retained the old class name only as a deprecated alias.
- Added explicit version/algorithm envelope metadata and field/key validation.
- Added tamper, malformed-envelope, round-trip, and invalid-key tests.
- Replaced fake success scripts with real typecheck/test/build/dependency-audit gates.
- Scoped the compiled package away from unrelated AI/security placeholder source.
- Removed misleading HTTP-service container packaging.
- Added security and key-management boundaries.
