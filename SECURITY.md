# Security Policy

This package provides a small AES-256-GCM envelope primitive. It is not a secrets-management system or KMS.

Report suspected vulnerabilities privately through GitHub security reporting where available.

Callers are responsible for key custody, rotation, authorization, secure deletion, backups, and preventing nonce misuse across independently implemented encryption paths. Never commit keys, passwords, tokens, mnemonics, or other secrets to this repository.

The implementation and automated tests are not a cryptographic audit. High-risk or production use should include independent review and threat modeling.
