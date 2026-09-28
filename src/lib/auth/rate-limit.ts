import "server-only";

import { createHmac } from "node:crypto";

import { getSqlClient } from "@/lib/db/client";
import { getTeamSlug } from "@/lib/env";

const WINDOW_MINUTES = 15;
const MAX_FAILURES = 5;

function fingerprint(request: Request): string {
  const secret = process.env.PIN_RATE_LIMIT_SECRET;
  if (!secret) throw new Error("PIN_RATE_LIMIT_NOT_CONFIGURED");
  const forwarded = request.headers
    .get("x-forwarded-for")
    ?.split(",")[0]
    ?.trim();
  const source = forwarded || request.headers.get("x-real-ip") || "unknown";
  return createHmac("sha256", secret).update(source).digest("base64url");
}

export async function isPinBlocked(request: Request): Promise<boolean> {
  const key = fingerprint(request);
  const teamSlug = getTeamSlug();
  const rows = await getSqlClient().query(
    `select blocked_until from pin_access_attempts
     where team_slug = $1 and fingerprint = $2 and blocked_until > now()`,
    [teamSlug, key],
  );
  return rows.length > 0;
}

export async function recordPinFailure(request: Request): Promise<void> {
  const key = fingerprint(request);
  const teamSlug = getTeamSlug();
  await getSqlClient().query(
    `insert into pin_access_attempts
       (team_slug, fingerprint, failed_count, window_started_at, blocked_until, updated_at)
     values ($1, $2, 1, now(), null, now())
     on conflict (team_slug, fingerprint) do update set
       failed_count = case
         when pin_access_attempts.window_started_at < now() - interval '${WINDOW_MINUTES} minutes'
           then 1
         else pin_access_attempts.failed_count + 1
       end,
       window_started_at = case
         when pin_access_attempts.window_started_at < now() - interval '${WINDOW_MINUTES} minutes'
           then now()
         else pin_access_attempts.window_started_at
       end,
       blocked_until = case
         when (
           case
             when pin_access_attempts.window_started_at < now() - interval '${WINDOW_MINUTES} minutes'
               then 1
             else pin_access_attempts.failed_count + 1
           end
         ) >= ${MAX_FAILURES}
           then now() + interval '${WINDOW_MINUTES} minutes'
         else pin_access_attempts.blocked_until
       end,
       updated_at = now()`,
    [teamSlug, key],
  );
}

export async function clearPinFailures(request: Request): Promise<void> {
  await getSqlClient().query(
    "delete from pin_access_attempts where team_slug = $1 and fingerprint = $2",
    [getTeamSlug(), fingerprint(request)],
  );
}
