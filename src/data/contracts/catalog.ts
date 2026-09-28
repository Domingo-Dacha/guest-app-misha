import { z } from "zod";

const idSchema = z.string().regex(/^[a-z0-9-]+$/);

export const houseSchema = z.object({
  id: idSchema,
  name: z.string().min(1).max(80),
  location: z.string().min(1).max(120),
  description: z.string().min(1).max(500),
  image: z.string().startsWith("/houses/"),
  capacity: z.number().int().positive().max(20),
  features: z.array(z.string().min(1).max(80)).min(1).max(12),
});

export const guestServiceSchema = z.object({
  id: idSchema,
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  priceKopecks: z.number().int().nonnegative(),
  conditions: z.string().min(1).max(300),
});

export const guestInstructionSchema = z.object({
  id: idSchema,
  title: z.string().min(1).max(120),
  summary: z.string().min(1).max(500),
  category: z.enum(["arrival", "house", "departure", "safety"]),
});

export const demoBookingSchema = z.object({
  id: idSchema,
  guestDisplayName: z.string().min(1).max(80),
  houseId: idSchema,
  checkIn: z.iso.date(),
  checkOut: z.iso.date(),
  guests: z.number().int().positive().max(20),
  checkInTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
});

export const recommendationSchema = z.object({
  id: idSchema,
  title: z.string().min(1).max(120),
  description: z.string().min(1).max(500),
  travelMinutes: z.number().int().nonnegative().max(240),
  category: z.enum(["nature", "food", "activity"]),
});

export const catalogFixtureSchema = z.object({
  houses: z.array(houseSchema).length(3),
  services: z.array(guestServiceSchema).min(3),
  instructions: z.array(guestInstructionSchema).min(3),
  booking: demoBookingSchema,
  recommendations: z.array(recommendationSchema).min(3),
});

export type House = z.infer<typeof houseSchema>;
export type GuestService = z.infer<typeof guestServiceSchema>;
export type GuestInstruction = z.infer<typeof guestInstructionSchema>;
export type DemoBooking = z.infer<typeof demoBookingSchema>;
export type LeisureRecommendation = z.infer<typeof recommendationSchema>;

export interface GuestCatalogRepository {
  listHouses(): Promise<House[]>;
  getHouse(id: string): Promise<House | null>;
  listServices(): Promise<GuestService[]>;
  listInstructions(): Promise<GuestInstruction[]>;
  getDemoBooking(): Promise<DemoBooking>;
  listRecommendations(): Promise<LeisureRecommendation[]>;
}
