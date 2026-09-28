import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "domingo_guest_session";
export const SESSION_TTL_SECONDS = 12 * 60 * 60;

type SessionPayload = {
  v: 1;
  team: string;
  exp: number;
};

function signature(encodedPayload: string, secret: string): Buffer {
  return createHmac("sha256", secret).update(encodedPayload).digest();
}

export function createSessionToken(
  team: string,
  secret: string,
  nowMs = Date.now(),
): string {
  const payload: SessionPayload = {
    v: 1,
    team,
    exp: Math.floor(nowMs / 1000) + SESSION_TTL_SECONDS,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${signature(encoded, secret).toString("base64url")}`;
}

export function verifySessionToken(
  token: string,
  team: string,
  secret: string,
  nowMs = Date.now(),
): boolean {
  try {
    const [encoded, providedSignature, extra] = token.split(".");
    if (!encoded || !providedSignature || extra) return false;
    const provided = Buffer.from(providedSignature, "base64url");
    const expected = signature(encoded, secret);
    if (
      provided.length !== expected.length ||
      !timingSafeEqual(provided, expected)
    ) {
      return false;
    }
    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8"),
    ) as SessionPayload;
    return (
      payload.v === 1 &&
      payload.team === team &&
      Number.isInteger(payload.exp) &&
      payload.exp > Math.floor(nowMs / 1000)
    );
  } catch {
    return false;
  }
}
