import { z } from "zod";

const teamSlugSchema = z.string().regex(/^[a-z0-9-]{1,48}$/);

export function getTeamSlug(): string {
  return teamSlugSchema.parse(process.env.TEAM_SLUG ?? "local");
}

export function demoWritesEnabled(): boolean {
  return process.env.DEMO_WRITES_ENABLED === "true";
}

export function getDatabaseUrl(): string | null {
  const value = process.env.DATABASE_URL?.trim();
  return value ? value : null;
}
