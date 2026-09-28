import { neon } from "@neondatabase/serverless";

async function main() {
  const databaseUrl = process.env.DATABASE_URL?.trim();
  const teamSlug = process.env.TEAM_SLUG?.trim();
  if (!databaseUrl) throw new Error("DATABASE_URL is required");
  if (!teamSlug || !/^[a-z0-9-]{1,48}$/.test(teamSlug)) {
    throw new Error("A valid TEAM_SLUG is required");
  }
  if (process.env.RESET_DEMO_DATA !== "yes") {
    throw new Error("Set RESET_DEMO_DATA=yes to confirm the scoped reset");
  }

  const sql = neon(databaseUrl);
  const deleted = await sql.query(
    "delete from guest_requests where team_slug = $1 returning id",
    [teamSlug],
  );
  await sql.query("delete from pin_access_attempts where team_slug = $1", [
    teamSlug,
  ]);
  console.log(`Deleted ${deleted.length} guest request(s) for ${teamSlug}`);
}

void main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Reset failed");
  process.exitCode = 1;
});
