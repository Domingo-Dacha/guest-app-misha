import { z } from "zod";

const slugSchema = z.string().regex(/^[a-z0-9-]+$/);

export const supportIconNames = [
  "route",
  "key",
  "furako",
  "fireplace",
  "bath",
  "wifi",
  "kitchen",
  "water",
  "electricity",
  "climate",
  "safety",
] as const;

export const supportInstructionSchema = z.object({
  slug: slugSchema,
  title: z.string().min(1).max(120),
  shortTitle: z.string().min(1).max(48),
  summary: z.string().min(1).max(240),
  categoryId: slugSchema,
  icon: z.enum(supportIconNames),
  featured: z.boolean(),
  durationMinutes: z.number().int().positive().max(20),
  media: z.object({
    kind: z.enum(["photo", "video"]),
    src: z.string().startsWith("/houses/"),
    alt: z.string().min(1).max(160),
    label: z.string().min(1).max(80),
  }),
  guide: z
    .object({
      href: z.url().startsWith("https://domingodacha.ru/"),
      label: z.string().min(1).max(80),
    })
    .optional(),
  steps: z
    .array(
      z.object({
        title: z.string().min(1).max(100),
        text: z.string().min(1).max(280),
      }),
    )
    .min(2)
    .max(6),
  note: z.string().min(1).max(300).optional(),
});

export const supportCategorySchema = z.object({
  id: slugSchema,
  title: z.string().min(1).max(80),
  description: z.string().min(1).max(180),
  icon: z.enum(supportIconNames),
});

export const supportContactSchema = z.object({
  id: slugSchema,
  label: z.string().min(1).max(48),
  description: z.string().min(1).max(100),
  kind: z.enum(["phone", "telegram", "whatsapp", "max", "email"]),
  href: z.string().startsWith("#"),
});

export const supportTicketStatuses = [
  "accepted",
  "assigned",
  "en_route",
  "resolved",
] as const;

export const supportTicketSchema = z.object({
  id: z.string().min(1).max(80),
  title: z.string().min(1).max(160),
  category: z.string().min(1).max(80),
  createdAt: z.iso.datetime(),
  status: z.enum(supportTicketStatuses),
  eta: z.string().min(1).max(120),
  assignedTo: z.string().min(1).max(100).optional(),
  assigneeImage: z.string().startsWith("/team/").optional(),
  updates: z
    .array(
      z.object({
        status: z.enum(supportTicketStatuses),
        title: z.string().min(1).max(100),
        detail: z.string().min(1).max(240),
        time: z.string().min(1).max(60),
        completed: z.boolean(),
      }),
    )
    .min(1)
    .max(6),
});

export const supportFixtureSchema = z.object({
  contacts: z.array(supportContactSchema).length(5),
  categories: z.array(supportCategorySchema).min(5),
  instructions: z.array(supportInstructionSchema).min(8),
  tickets: z.array(supportTicketSchema).min(2),
});

export type SupportIconName = (typeof supportIconNames)[number];
export type SupportInstruction = z.infer<typeof supportInstructionSchema>;
export type SupportCategory = z.infer<typeof supportCategorySchema>;
export type SupportContact = z.infer<typeof supportContactSchema>;
export type SupportTicket = z.infer<typeof supportTicketSchema>;
export type SupportTicketStatus = (typeof supportTicketStatuses)[number];

export interface SupportRepository {
  listContacts(): Promise<SupportContact[]>;
  listCategories(): Promise<SupportCategory[]>;
  listInstructions(): Promise<SupportInstruction[]>;
  getInstruction(slug: string): Promise<SupportInstruction | null>;
  listDemoTickets(): Promise<SupportTicket[]>;
  getDemoTicket(id: string): Promise<SupportTicket | null>;
}
