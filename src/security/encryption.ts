import crypto from 'node:crypto';

export interface EncryptedEnvelope {
  version: 1;
  algorithm: 'aes-256-gcm';
  iv: string;
  ciphertext: string;
  authTag: string;
}

const KEY_BYTES = 32;
const IV_BYTES = 12;
const HEX = /^[0-9a-f]+$/i;

function assertKey(key: Buffer): void {
  if (!Buffer.isBuffer(key) || key.length !== KEY_BYTES) {
    throw new Error('AES-256-GCM key must be exactly 32 bytes');
  }
}

function decodeHex(value: string, expectedBytes: number | null, field: string): Buffer {
  if (!value || value.length % 2 !== 0 || !HEX.test(value)) throw new Error(`${field} must be valid hex`);
  const decoded = Buffer.from(value, 'hex');
  if (expectedBytes !== null && decoded.length !== expectedBytes) {
    throw new Error(`${field} must be ${expectedBytes} bytes`);
  }
  return decoded;
}

export class AesGcmEnvelope {
  generateKey(): Buffer {
    return crypto.randomBytes(KEY_BYTES);
  }

  encrypt(data: string, key: Buffer): EncryptedEnvelope {
    assertKey(key);
    const iv = crypto.randomBytes(IV_BYTES);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    const ciphertext = Buffer.concat([cipher.update(data, 'utf8'), cipher.final()]);
    return {
      version: 1,
      algorithm: 'aes-256-gcm',
      iv: iv.toString('hex'),
      ciphertext: ciphertext.toString('hex'),
      authTag: cipher.getAuthTag().toString('hex'),
    };
  }

  decrypt(envelope: EncryptedEnvelope, key: Buffer): string {
    assertKey(key);
    if (envelope.version !== 1 || envelope.algorithm !== 'aes-256-gcm') {
      throw new Error('unsupported encrypted envelope');
    }
    const iv = decodeHex(envelope.iv, IV_BYTES, 'iv');
    const authTag = decodeHex(envelope.authTag, 16, 'authTag');
    const ciphertext = decodeHex(envelope.ciphertext, null, 'ciphertext');
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);
    return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8');
  }
}

/** @deprecated Use AesGcmEnvelope. The old name made an unsupported security claim. */
export class MilitaryGradeEncryption extends AesGcmEnvelope {}
