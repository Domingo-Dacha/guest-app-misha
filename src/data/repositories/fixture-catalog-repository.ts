import type { GuestCatalogRepository } from "@/data/contracts/catalog";
import { catalogFixture } from "@/data/fixtures/catalog";

export const fixtureCatalogRepository: GuestCatalogRepository = {
  async listHouses() {
    return catalogFixture.houses;
  },
  async getHouse(id) {
    return catalogFixture.houses.find((house) => house.id === id) ?? null;
  },
  async listServices() {
    return catalogFixture.services;
  },
  async listInstructions() {
    return catalogFixture.instructions;
  },
  async getDemoBooking() {
    return catalogFixture.booking;
  },
  async listRecommendations() {
    return catalogFixture.recommendations;
  },
};
