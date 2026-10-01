import type { SupportRepository } from "@/data/contracts/support";
import { supportFixture } from "@/data/fixtures/support";

export const fixtureSupportRepository: SupportRepository = {
  async listContacts() {
    return supportFixture.contacts;
  },
  async listCategories() {
    return supportFixture.categories;
  },
  async listInstructions() {
    return supportFixture.instructions;
  },
  async getInstruction(slug) {
    return (
      supportFixture.instructions.find(
        (instruction) => instruction.slug === slug,
      ) ?? null
    );
  },
  async listDemoTickets() {
    return supportFixture.tickets;
  },
  async getDemoTicket(id) {
    return supportFixture.tickets.find((ticket) => ticket.id === id) ?? null;
  },
};
