import { describe, expect, it } from 'vitest';
import { AesGcmEnvelope } from '../src/security/encryption';

describe('AesGcmEnvelope', () => {
  it('round-trips UTF-8 plaintext with authenticated encryption', () => {
    const crypto = new AesGcmEnvelope();
    const key = crypto.generateKey();
    const envelope = crypto.encrypt('hello SKYCOIN4444 🔐', key);

    expect(envelope.version).toBe(1);
    expect(envelope.algorithm).toBe('aes-256-gcm');
    expect(envelope.iv).toHaveLength(24);
    expect(envelope.authTag).toHaveLength(32);
    expect(crypto.decrypt(envelope, key)).toBe('hello SKYCOIN4444 🔐');
  });

  it('rejects invalid key lengths', () => {
    const crypto = new AesGcmEnvelope();
    expect(() => crypto.encrypt('data', Buffer.alloc(31))).toThrow(/32 bytes/);
  });

  it('rejects tampered ciphertext', () => {
    const crypto = new AesGcmEnvelope();
    const key = crypto.generateKey();
    const envelope = crypto.encrypt('protected', key);
    const first = envelope.ciphertext.startsWith('00') ? '01' : '00';
    const tampered = { ...envelope, ciphertext: `${first}${envelope.ciphertext.slice(2)}` };
    expect(() => crypto.decrypt(tampered, key)).toThrow();
  });

  it('rejects malformed envelope metadata', () => {
    const crypto = new AesGcmEnvelope();
    const key = crypto.generateKey();
    const envelope = crypto.encrypt('protected', key);
    expect(() => crypto.decrypt({ ...envelope, iv: 'zz' }, key)).toThrow(/iv/);
    expect(() => crypto.decrypt({ ...envelope, version: 2 } as never, key)).toThrow(/unsupported/);
  });
});
