import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getTeamSlug } from "@/lib/env";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/token";

export async function hasValidSession(): Promise<boolean> {
  const secret = process.env.SESSION_SECRET;
  if (!secret) return false;
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return token ? verifySessionToken(token, getTeamSlug(), secret) : false;
}

export async function requirePageSession(): Promise<void> {
  if (!(await hasValidSession())) redirect("/access");
}
