import "server-only";

import { and, desc, eq } from "drizzle-orm";

import type {
  CreateGuestRequest,
  GuestRequest,
  GuestRequestRepository,
} from "@/data/contracts/guest-request";
import { getTeamSlug } from "@/lib/env";
import { getDatabase } from "@/lib/db/client";
import { guestRequests } from "@/lib/db/schema";

function toGuestRequest(row: typeof guestRequests.$inferSelect): GuestRequest {
  return {
    id: row.id,
    teamSlug: row.teamSlug,
    kind: row.kind as GuestRequest["kind"],
    guestName: row.guestName ?? undefined,
    message: row.message,
    status: row.status as GuestRequest["status"],
    createdAt: row.createdAt.toISOString(),
  };
}

export class PostgresGuestRequestRepository implements GuestRequestRepository {
  async create(input: CreateGuestRequest): Promise<GuestRequest> {
    const db = getDatabase();
    const teamSlug = getTeamSlug();
    const [created] = await db
      .insert(guestRequests)
      .values({
        teamSlug,
        kind: input.kind,
        guestName: input.guestName,
        message: input.message,
        idempotencyKey: input.idempotencyKey,
      })
      .onConflictDoNothing()
      .returning();

    if (created) return toGuestRequest(created);

    const [existing] = await db
      .select()
      .from(guestRequests)
      .where(
        and(
          eq(guestRequests.teamSlug, teamSlug),
          eq(guestRequests.idempotencyKey, input.idempotencyKey),
        ),
      )
      .limit(1);

    if (!existing) throw new Error("IDEMPOTENCY_CONFLICT_WITHOUT_ROW");
    return toGuestRequest(existing);
  }

  async listRecent(limit: number): Promise<GuestRequest[]> {
    const rows = await getDatabase()
      .select()
      .from(guestRequests)
      .where(eq(guestRequests.teamSlug, getTeamSlug()))
      .orderBy(desc(guestRequests.createdAt))
      .limit(Math.min(Math.max(limit, 1), 50));
    return rows.map(toGuestRequest);
  }
}

export const guestRequestRepository = new PostgresGuestRequestRepository();
