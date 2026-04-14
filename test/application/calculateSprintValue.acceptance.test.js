import test from "node:test";
import assert from "node:assert/strict";

import { calculateSprintValueUseCase } from "../../src/application/usecases/calculateSprintValue.js";

test("acceptance: canonical example returns 6 story days and 13 RNF hours", () => {
  const result = calculateSprintValueUseCase({
    developers: 7,
    developmentHoursPerDay: 6,
    storyPoints: 55,
    pointValue: 4,
  });

  assert.equal(result.ok, true);
  assert.equal(result.data.output.requiredStoryDays.value, 6);
  assert.equal(result.data.output.rnfHours.value, 13);
});

test("acceptance: RNF days scenario returns 1 with default two developers", () => {
  const result = calculateSprintValueUseCase({
    developers: 7,
    developmentHoursPerDay: 6,
    storyPoints: 55,
    pointValue: 4,
  });

  assert.equal(result.ok, true);
  assert.equal(result.data.output.rnfDays.value, 1);
});

test("acceptance: skips RNF day calculation when rnfDeveloperCount is zero", () => {
  const result = calculateSprintValueUseCase(
    {
      developers: 7,
      developmentHoursPerDay: 6,
      storyPoints: 55,
      pointValue: 4,
    },
    {
      rnfDeveloperCount: 0,
    },
  );

  assert.equal(result.ok, true);
  assert.equal(result.data.output.rnfHours.value, 13);
  assert.equal(result.data.output.rnfDays.raw, 0);
  assert.equal(result.data.output.rnfDays.value, 0);
});

test("acceptance: skips RNF day calculation when rnfDeveloperCount is NaN", () => {
  const result = calculateSprintValueUseCase(
    {
      developers: 7,
      developmentHoursPerDay: 6,
      storyPoints: 55,
      pointValue: 4,
    },
    {
      rnfDeveloperCount: Number.NaN,
    },
  );

  assert.equal(result.ok, true);
  assert.equal(result.data.output.rnfHours.value, 13);
  assert.equal(result.data.output.rnfDays.raw, 0);
  assert.equal(result.data.output.rnfDays.value, 0);
  assert.ok(Number.isNaN(result.data.policy.rnfDeveloperCount));
});
