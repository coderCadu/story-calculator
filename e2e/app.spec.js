import { test, expect } from "@playwright/test";

function metricValue(page, label) {
  return page
    .locator(".result-card")
    .filter({ has: page.locator(".title", { hasText: label }) })
    .locator(".value");
}

async function fillSprintForm(page, form) {
  await page.getByLabel("Quantidade de desenvolvedores").fill(String(form.developers));
  await page
    .getByLabel("Horas de desenvolvimento por dia")
    .fill(String(form.developmentHoursPerDay));
  await page.getByLabel("Duração da sprint (dias)").fill(String(form.sprintDurationDays));

  const rnfCheckbox = page.getByLabel("Incluir RNF");
  if (form.hasRnf) {
    await rnfCheckbox.check();
  } else {
    await rnfCheckbox.uncheck();
  }

  await page.getByLabel("Pontos totais da história").fill(String(form.storyPoints));
  await page.getByLabel("Valor de cada ponto").fill(String(form.pointValue));
  await page
    .getByLabel("Refinamento técnico (horas)")
    .fill(String(form.technicalRefinementHours));
}

test.describe("Story Calculator", () => {
  test("calcula os valores da sprint corretamente com RNF", async ({ page }) => {
    await page.goto("/");

    await fillSprintForm(page, {
      developers: 7,
      developmentHoursPerDay: 6,
      sprintDurationDays: 10,
      hasRnf: true,
      storyPoints: 55,
      pointValue: 4,
      technicalRefinementHours: 26,
    });

    await page.getByRole("button", { name: "Calcular sprint" }).click();

    await expect(metricValue(page, "Capacidade diária total")).toHaveText("42");
    await expect(metricValue(page, "Capacidade total do sprint")).toHaveText("420");
    await expect(metricValue(page, "Devs funcionais")).toHaveText("5");
    await expect(metricValue(page, "Capacidade diária funcional")).toHaveText("30");
    await expect(metricValue(page, "Esforço base da história")).toHaveText("220");
    await expect(metricValue(page, "Com refinamento técnico")).toHaveText("246");
    await expect(metricValue(page, "Devs alocados para RNF")).toContainText("2");
    await expect(metricValue(page, "Horas alocadas para RNF")).toContainText("120");
  });

  test("calcula os valores da sprint corretamente sem RNF", async ({ page }) => {
    await page.goto("/");

    await fillSprintForm(page, {
      developers: 7,
      developmentHoursPerDay: 6,
      sprintDurationDays: 10,
      hasRnf: false,
      storyPoints: 55,
      pointValue: 4,
      technicalRefinementHours: 26,
    });

    await page.getByRole("button", { name: "Calcular sprint" }).click();

    await expect(metricValue(page, "Devs funcionais")).toHaveText("7");
    await expect(metricValue(page, "Capacidade diária funcional")).toHaveText("42");
    await expect(page.getByText("RNF Allocation")).toHaveCount(0);
  });

  test("valida campos obrigatórios e exibe mensagem de erro", async ({ page }) => {
    await page.goto("/");

    await fillSprintForm(page, {
      developers: 7,
      developmentHoursPerDay: 6,
      sprintDurationDays: 10,
      hasRnf: false,
      storyPoints: 0,
      pointValue: 4,
      technicalRefinementHours: 26,
    });

    await page.getByRole("button", { name: "Calcular sprint" }).click();

    await expect(page.locator(".feedback-error")).toBeVisible();
  });

  test("mantém a aparência visual do estado inicial", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveScreenshot("sprint-calculator-empty.png", {
      fullPage: true,
    });
  });

  test("mantém a aparência visual do dashboard preenchido", async ({ page }) => {
    await page.goto("/");

    await fillSprintForm(page, {
      developers: 7,
      developmentHoursPerDay: 6,
      sprintDurationDays: 10,
      hasRnf: true,
      storyPoints: 55,
      pointValue: 4,
      technicalRefinementHours: 26,
    });

    await page.getByRole("button", { name: "Calcular sprint" }).click();
    await expect(page.locator(".results-dashboard")).toBeVisible();

    await expect(page).toHaveScreenshot("sprint-calculator-filled.png", {
      fullPage: true,
    });
  });
});
