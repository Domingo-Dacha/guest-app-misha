import "server-only";

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import { getDatabaseUrl } from "@/lib/env";
import * as schema from "@/lib/db/schema";

export function getDatabase() {
  const url = getDatabaseUrl();
  if (!url) throw new Error("DATABASE_NOT_CONFIGURED");
  return drizzle(neon(url), { schema });
}

export function getSqlClient() {
  const url = getDatabaseUrl();
  if (!url) throw new Error("DATABASE_NOT_CONFIGURED");
  return neon(url);
}
