import test from "node:test";
import assert from "node:assert/strict";

import { calculateSprintIntegration } from "../../src/domain/services/sprintIntegrationCalculator.js";

// Tasks 6.7-6.8: Test sprint integration and fit analysis

test("required days calculation using functional capacity: 246h ÷ 42h/day", () => {
  const result = calculateSprintIntegration(
    { refinedStoryEffort: 246 },
    { functionalDailyCapacity: 42 },
    10
  );

  assert.equal(result.rawRequiredDays, 5.85);
  assert.equal(result.roundedRequiredDays, 6);
  assert.equal(result.sprintDurationDays, 10);
  assert.equal(result.fitsInSprint, true);
  assert.equal(result.remainingDays, 4);
});

test("sprint doesn't fit: 500h ÷ 30h/day = 16.67 days (> 10 days)", () => {
  const result = calculateSprintIntegration(
    { refinedStoryEffort: 500 },
    { functionalDailyCapacity: 30 },
    10
  );

  assert.equal(result.rawRequiredDays, 16.66);
  assert.equal(result.roundedRequiredDays, 17);
  assert.equal(result.sprintDurationDays, 10);
  assert.equal(result.fitsInSprint, false);
  assert.equal(result.remainingDays, -7);
});

test("exact fit: 300h ÷ 30h/day = 10 days (exact)", () => {
  const result = calculateSprintIntegration(
    { refinedStoryEffort: 300 },
    { functionalDailyCapacity: 30 },
    10
  );

  assert.equal(result.rawRequiredDays, 10.00);
  assert.equal(result.roundedRequiredDays, 10);
  assert.equal(result.sprintDurationDays, 10);
  assert.equal(result.fitsInSprint, true);
  assert.equal(result.remainingDays, 0);
});

test("remaining days positive: 100h ÷ 50h/day = 2 days (8 days remaining)", () => {
  const result = calculateSprintIntegration(
    { refinedStoryEffort: 100 },
    { functionalDailyCapacity: 50 },
    10
  );

  assert.equal(result.rawRequiredDays, 2.00);
  assert.equal(result.roundedRequiredDays, 2);
  assert.equal(result.fitsInSprint, true);
  assert.equal(result.remainingDays, 8);
});

test("remaining days zero: perfect fit at boundary", () => {
  const result = calculateSprintIntegration(
    { refinedStoryEffort: 200 },
    { functionalDailyCapacity: 40 },
    5
  );

  assert.equal(result.rawRequiredDays, 5.00);
  assert.equal(result.roundedRequiredDays, 5);
  assert.equal(result.fitsInSprint, true);
  assert.equal(result.remainingDays, 0);
});

test("remaining days negative: overcommitted sprint", () => {
  const result = calculateSprintIntegration(
    { refinedStoryEffort: 600 },
    { functionalDailyCapacity: 40 },
    10
  );

  assert.equal(result.rawRequiredDays, 15.00);
  assert.equal(result.roundedRequiredDays, 15);
  assert.equal(result.fitsInSprint, false);
  assert.equal(result.remainingDays, -5);
});

test("edge case: rounding up creates boundary fit (9.1 → 10)", () => {
  const result = calculateSprintIntegration(
    { refinedStoryEffort: 273 },
    { functionalDailyCapacity: 30 },
    10
  );

  assert.equal(result.rawRequiredDays, 9.10);
  assert.equal(result.roundedRequiredDays, 10);
  assert.equal(result.fitsInSprint, true);
  assert.equal(result.remainingDays, 0);
});

test("edge case: just over boundary (10.01 → 11, doesn't fit)", () => {
  const result = calculateSprintIntegration(
    { refinedStoryEffort: 300.3 },
    { functionalDailyCapacity: 30 },
    10
  );

  assert.equal(result.rawRequiredDays, 10.01);
  assert.equal(result.roundedRequiredDays, 11);
  assert.equal(result.fitsInSprint, false);
  assert.equal(result.remainingDays, -1);
});

test("truncation to 2 decimals: 246 ÷ 42 = 5.857... → 5.85", () => {
  const result = calculateSprintIntegration(
    { refinedStoryEffort: 246 },
    { functionalDailyCapacity: 42 },
    10
  );

  assert.equal(result.rawRequiredDays, 5.85);
});

test("small effort: 15h ÷ 30h/day = 0.50 days (9 days remaining)", () => {
  const result = calculateSprintIntegration(
    { refinedStoryEffort: 15 },
    { functionalDailyCapacity: 30 },
    10
  );

  assert.equal(result.rawRequiredDays, 0.50);
  assert.equal(result.roundedRequiredDays, 1);
  assert.equal(result.fitsInSprint, true);
  assert.equal(result.remainingDays, 9);
});

test("very large sprint: 2000h ÷ 100h/day = 20 days", () => {
  const result = calculateSprintIntegration(
    { refinedStoryEffort: 2000 },
    { functionalDailyCapacity: 100 },
    20
  );

  assert.equal(result.rawRequiredDays, 20.00);
  assert.equal(result.roundedRequiredDays, 20);
  assert.equal(result.fitsInSprint, true);
  assert.equal(result.remainingDays, 0);
});
