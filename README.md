# SKYCOIN4444 Crypto Envelope

A small TypeScript utility for AES-256-GCM authenticated encryption envelopes. It is a reusable engineering component, not a key-management system, secrets vault, password manager, compliance certification, or claim of “military-grade” security.

## Implemented behavior

- generates cryptographically random 32-byte AES keys
- encrypts UTF-8 plaintext with AES-256-GCM
- uses a fresh 12-byte nonce/IV for each encryption
- returns an explicit versioned envelope containing algorithm, IV, ciphertext, and authentication tag
- validates key length and hex envelope fields
- rejects unsupported envelope versions/algorithms
- authenticated decryption rejects modified ciphertext or tags
- retains the historical `MilitaryGradeEncryption` class only as a deprecated compatibility alias

```ts
import { AesGcmEnvelope } from "@skycoin4444/crypto-envelope";

const crypto = new AesGcmEnvelope();
const key = crypto.generateKey();
const envelope = crypto.encrypt("example", key);
const plaintext = crypto.decrypt(envelope, key);
```

## Verification

```bash
npm install
npm run lint
npm test
npm run build
npm audit --audit-level=high
```

CI runs typecheck, tests, library build, and dependency audit on main, product branches, and pull requests. Tests cover round trips, key validation, malformed envelopes, and ciphertext tampering.

## Security boundaries

The caller owns key generation policy, key storage, rotation, access control, backup, secure deletion, and transport. Never store encryption keys beside ciphertext. Do not reuse a fixed IV with the same key. Do not treat this utility as a replacement for a managed KMS/HSM or a reviewed secrets-management platform.

No independent cryptographic/security audit has been performed. Production use requires threat modeling and review appropriate to the data being protected.

## Product scope

The repository previously contained generic AI/security-agent placeholders and scripts that always reported success. The active package build is intentionally scoped only to the authenticated-encryption utility; unrelated historical source remains preserved in Git history but is not part of this package artifact.

**Classification:** ENGINEERING LAB / beta library.

## License

MIT; see `LICENSE`.
