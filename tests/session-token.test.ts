import { describe, expect, it } from "vitest";
import {
  createSessionToken,
  SESSION_TTL_SECONDS,
  verifySessionToken,
} from "@/lib/auth/token";

const secret = "a-secret-long-enough-for-the-test-suite";
const now = Date.UTC(2026, 8, 28, 10, 0, 0);

describe("PIN session token", () => {
  it("accepts a valid token for the same team", () => {
    const token = createSessionToken("nina", secret, now);
    expect(verifySessionToken(token, "nina", secret, now + 1_000)).toBe(true);
  });

  it("rejects tampering, another team and an expired token", () => {
    const token = createSessionToken("nina", secret, now);
    expect(verifySessionToken(`${token}x`, "nina", secret, now)).toBe(false);
    expect(verifySessionToken(token, "misha", secret, now)).toBe(false);
    expect(
      verifySessionToken(
        token,
        "nina",
        secret,
        now + SESSION_TTL_SECONDS * 1_000,
      ),
    ).toBe(false);
  });
});
