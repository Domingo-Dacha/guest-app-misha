import { describe, expect, it } from "vitest";
import { catalogFixtureSchema } from "@/data/contracts/catalog";
import { catalogFixture } from "@/data/fixtures/catalog";
import { fixtureCatalogRepository } from "@/data/repositories/fixture-catalog-repository";

describe("guest catalog fixture", () => {
  it("matches the shared contract and contains exactly three houses", () => {
    expect(catalogFixtureSchema.safeParse(catalogFixture).success).toBe(true);
    expect(catalogFixture.houses).toHaveLength(3);
  });

  it("is exposed through the repository boundary", async () => {
    await expect(fixtureCatalogRepository.listHouses()).resolves.toEqual(
      catalogFixture.houses,
    );
    await expect(
      fixtureCatalogRepository.getHouse("missing-house"),
    ).resolves.toBeNull();
  });

  it("contains no realistic access codes or personal contacts", () => {
    const serialized = JSON.stringify(catalogFixture);
    expect(serialized).not.toMatch(/\+7\d{10}|@\w+|код.{0,10}\d{4}/i);
  });
});
