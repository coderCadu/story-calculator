import test from "node:test";
import assert from "node:assert/strict";

import { calculateSprintValueUseCase } from "../../src/application/usecases/calculateSprintValue.js";

test("validation: returns deterministic structured errors for missing fields", () => {
  const result = calculateSprintValueUseCase({
    developers: 7,
  });

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "VALIDATION_ERROR");
  assert.deepEqual(
    result.error.details.map((detail) => detail.code),
    [
      "MISSING_REQUIRED_FIELD",
      "MISSING_REQUIRED_FIELD",
      "MISSING_REQUIRED_FIELD",
    ],
  );
});

test("validation: blocks non-positive values to prevent invalid divisions", () => {
  const result = calculateSprintValueUseCase({
    developers: 0,
    developmentHoursPerDay: -1,
    storyPoints: 55,
    pointValue: 4,
  });

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "VALIDATION_ERROR");
  assert.deepEqual(
    result.error.details.map((detail) => detail.field),
    ["developers", "developmentHoursPerDay"],
  );
  assert.deepEqual(
    result.error.details.map((detail) => detail.code),
    ["NON_POSITIVE_VALUE", "NON_POSITIVE_VALUE"],
  );
});

test("validation: rejects negative rnfDeveloperCount in policy override", () => {
  const result = calculateSprintValueUseCase(
    {
      developers: 7,
      developmentHoursPerDay: 6,
      storyPoints: 55,
      pointValue: 4,
    },
    {
      technicalRefinementHours: 26,
      rnfDeveloperCount: -1,
    },
  );

  assert.equal(result.ok, false);
  assert.deepEqual(
    result.error.details.map((detail) => detail.field),
    ["rnfDeveloperCount"],
  );
  assert.deepEqual(
    result.error.details.map((detail) => detail.code),
    ["NON_POSITIVE_VALUE"],
  );
});

test("validation: allows rnfDeveloperCount zero and NaN for RNF fallback", () => {
  const zeroResult = calculateSprintValueUseCase(
    {
      developers: 7,
      developmentHoursPerDay: 6,
      storyPoints: 55,
      pointValue: 4,
    },
    {
      technicalRefinementHours: 26,
      rnfDeveloperCount: 0,
    },
  );

  const nanResult = calculateSprintValueUseCase(
    {
      developers: 7,
      developmentHoursPerDay: 6,
      storyPoints: 55,
      pointValue: 4,
    },
    {
      technicalRefinementHours: 26,
      rnfDeveloperCount: Number.NaN,
    },
  );

  assert.equal(zeroResult.ok, true);
  assert.equal(nanResult.ok, true);

  assert.equal(zeroResult.data.output.rnfDays.raw, 0);
  assert.equal(zeroResult.data.output.rnfDays.value, 0);
  assert.equal(nanResult.data.output.rnfDays.raw, 0);
  assert.equal(nanResult.data.output.rnfDays.value, 0);
  assert.ok(Number.isNaN(nanResult.data.policy.rnfDeveloperCount));
});
