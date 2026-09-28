import { expect, test } from "@playwright/test";

test("the protected entry screen works on a phone viewport", async ({
  page,
}) => {
  await page.goto("/access");
  await expect(
    page.getByRole("heading", { name: "Введите PIN команды" }),
  ).toBeVisible();
  await expect(page.getByLabel("PIN")).toBeVisible();

  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
});

test("the access form explains invalid configuration without leaking details", async ({
  page,
}) => {
  await page.goto("/access");
  await page.getByLabel("PIN").pressSequentially("123456");
  await expect(
    page.getByRole("button", { name: "Открыть приложение" }),
  ).toBeEnabled();
  await page.getByRole("button", { name: "Открыть приложение" }).click();
  await expect(
    page.getByText("Доступ пока не настроен", { exact: true }),
  ).toBeVisible();
});
