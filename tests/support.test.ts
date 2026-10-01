import { describe, expect, it } from "vitest";

import { supportFixtureSchema } from "@/data/contracts/support";
import { supportFixture } from "@/data/fixtures/support";
import { fixtureSupportRepository } from "@/data/repositories/fixture-support-repository";

describe("guest support fixture", () => {
  it("matches the support contract", () => {
    expect(supportFixtureSchema.safeParse(supportFixture).success).toBe(true);
    expect(
      supportFixture.instructions.filter((instruction) => instruction.featured),
    ).toHaveLength(4);
  });

  it("is exposed through the repository boundary", async () => {
    await expect(
      fixtureSupportRepository.getInstruction("open-keybox"),
    ).resolves.toMatchObject({ shortTitle: "Как зайти в дом" });
    await expect(
      fixtureSupportRepository.getDemoTicket("missing-ticket"),
    ).resolves.toBeNull();
  });

  it("contains no live contacts, addresses or access codes", () => {
    const serialized = JSON.stringify(supportFixture);
    expect(serialized).not.toMatch(/\+7\d{10}|https?:\/\/(?:t\.me|wa\.me)/i);
    expect(serialized).not.toMatch(/код.{0,10}\d{4}/i);
    expect(
      supportFixture.contacts.every((contact) => contact.href.startsWith("#")),
    ).toBe(true);
  });
});
