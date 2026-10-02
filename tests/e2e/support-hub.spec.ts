import { expect, test } from "@playwright/test";

import { createSessionToken, SESSION_COOKIE } from "../../src/lib/auth/token";

test.beforeEach(async ({ context }) => {
  await context.addCookies([
    {
      name: SESSION_COOKIE,
      value: createSessionToken("e2e", "e2e-session-secret"),
      url: "http://localhost:3000",
    },
  ]);
});

test("mobile dock opens the ticket form above the navigation", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-webkit");

  await page.goto("/");
  const dock = page.locator(".mobile-dock");
  const trigger = dock.getByRole("button", { name: "Создать обращение" });

  await expect(trigger).toBeEnabled();
  await trigger.click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(page.locator("body > .ticket-dialog")).toBeVisible();
  await expect(
    dialog.getByRole("heading", { name: "Создать обращение" }),
  ).toBeVisible();
});

test("support hub works from search to a contextual ticket", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Помощь рядом" }),
  ).toBeVisible();

  if (testInfo.project.name === "mobile-webkit") {
    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      content: document.documentElement.scrollWidth,
    }));
    expect(dimensions.viewport).toBe(390);
    expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
  }

  await page.getByRole("button", { name: "Создать обращение" }).first().click();
  const homeDialog = page.getByRole("dialog");
  await expect(homeDialog).toBeVisible();
  await expect(
    homeDialog.getByRole("heading", { name: "Создать обращение" }),
  ).toBeVisible();
  await homeDialog.getByRole("button", { name: "Закрыть форму" }).click();

  const search = page.getByPlaceholder("Поиск: Wi-Fi, камин, горячая вода…");
  await search.fill("проектор");
  const projectorLink = page.getByRole("link", { name: /Проектор/ });
  await expect(projectorLink).toBeVisible();
  await Promise.all([
    page.waitForURL(/\/instructions\/projector-start$/),
    projectorLink.click(),
  ]);
  await page.waitForLoadState("networkidle");

  await expect(
    page.getByRole("heading", { name: "Как включить проектор" }),
  ).toBeVisible();
  const instructionTrigger = page
    .getByRole("button", { name: "Создать обращение" })
    .first();
  await expect(instructionTrigger).toBeEnabled();
  await instructionTrigger.click();
  const instructionDialog = page.getByRole("dialog");
  await expect(instructionDialog).toBeVisible();
  await expect(instructionDialog.getByLabel("Что случилось")).toHaveValue(
    "Техника",
  );
  await expect(
    instructionDialog.getByPlaceholder(/выполнил шаги инструкции «Проектор»/),
  ).toBeVisible();

  await page.goto("/tickets/demo-hot-water");
  await expect(
    page.getByAltText("Фото назначенного специалиста"),
  ).toBeVisible();
});

test("furako and fireplace details show compact safety instructions", async ({
  page,
}) => {
  await page.goto("/instructions/furako-start");
  await expect(
    page.getByRole("heading", { name: "Как пользоваться фурако" }),
  ).toBeVisible();
  await expect(page.locator(".instruction-steps li")).toHaveCount(3);
  await expect(
    page.getByRole("link", { name: "Открыть полную инструкцию по фурако" }),
  ).toHaveAttribute("href", "https://domingodacha.ru/furakoinst");

  await page.goto("/instructions/light-fireplace");
  await expect(page.locator(".instruction-steps li")).toHaveCount(4);
  await expect(page.getByText("Жидкий розжиг запрещён.")).toBeVisible();
});
