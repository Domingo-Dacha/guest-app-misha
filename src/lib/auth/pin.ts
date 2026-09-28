import { promisify } from "node:util";
import { scrypt, timingSafeEqual } from "node:crypto";

const scryptAsync = promisify(scrypt);

export async function hashPin(pin: string, salt: string): Promise<Buffer> {
  return (await scryptAsync(pin, salt, 64)) as Buffer;
}

export async function verifyPin(
  pin: string,
  salt: string,
  expectedHash: string,
): Promise<boolean> {
  try {
    const actual = await hashPin(pin, salt);
    const expected = Buffer.from(expectedHash, "base64url");
    return (
      actual.length === expected.length && timingSafeEqual(actual, expected)
    );
  } catch {
    return false;
  }
}
