import { z } from "zod";

export const guestRequestKinds = ["question", "service", "help"] as const;

export const createGuestRequestSchema = z.object({
  kind: z.enum(guestRequestKinds),
  guestName: z.string().trim().min(1).max(80).optional(),
  message: z.string().trim().min(3).max(2000),
  idempotencyKey: z.uuid(),
});

export const guestRequestSchema = createGuestRequestSchema
  .omit({
    idempotencyKey: true,
  })
  .extend({
    id: z.uuid(),
    teamSlug: z.string().min(1).max(48),
    status: z.enum(["new", "in_progress", "done"]),
    createdAt: z.iso.datetime(),
  });

export type CreateGuestRequest = z.infer<typeof createGuestRequestSchema>;
export type GuestRequest = z.infer<typeof guestRequestSchema>;

export interface GuestRequestRepository {
  create(input: CreateGuestRequest): Promise<GuestRequest>;
  listRecent(limit: number): Promise<GuestRequest[]>;
}
