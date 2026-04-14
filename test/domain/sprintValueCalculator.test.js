import test from "node:test";
import assert from "node:assert/strict";

import { DEFAULT_CALCULATION_POLICY } from "../../src/domain/policies/calculationPolicy.js";
import { calculateSprintValueDomain } from "../../src/domain/services/sprintValueCalculator.js";

test("domain calculator applies all formulas and rounding policies", () => {
  const result = calculateSprintValueDomain(
    {
      developers: 7,
      developmentHoursPerDay: 6,
      storyPoints: 55,
      pointValue: 4,
    },
    DEFAULT_CALCULATION_POLICY,
  );

  assert.equal(result.dailyCapacity, 42);
  assert.equal(result.totalStoryEffort, 220);
  assert.equal(result.technicalRefinementHours, 26);
  assert.equal(result.refinedStoryEffort, 246);
  assert.equal(result.rawRequiredDays, 5.85);
  assert.equal(result.roundedRequiredDays, 6);
  assert.equal(result.rawRnfHours, 12.6);
  assert.equal(result.roundedRnfHours, 13);
  assert.equal(result.rnfDailyCapacity, 12);
  assert.equal(result.rawRnfDays, 1.08);
  assert.equal(result.roundedRnfDays, 1);
});

test("domain calculator skips RNF days when rnfDeveloperCount is zero", () => {
  const result = calculateSprintValueDomain(
    {
      developers: 7,
      developmentHoursPerDay: 6,
      storyPoints: 55,
      pointValue: 4,
    },
    {
      ...DEFAULT_CALCULATION_POLICY,
      rnfDeveloperCount: 0,
    },
  );

  assert.equal(result.rnfDailyCapacity, 0);
  assert.equal(result.rawRnfDays, 0);
  assert.equal(result.roundedRnfDays, 0);
});

test("domain calculator skips RNF days when rnfDeveloperCount is NaN", () => {
  const result = calculateSprintValueDomain(
    {
      developers: 7,
      developmentHoursPerDay: 6,
      storyPoints: 55,
      pointValue: 4,
    },
    {
      ...DEFAULT_CALCULATION_POLICY,
      rnfDeveloperCount: Number.NaN,
    },
  );

  assert.equal(result.rnfDailyCapacity, 0);
  assert.equal(result.rawRnfDays, 0);
  assert.equal(result.roundedRnfDays, 0);
});
