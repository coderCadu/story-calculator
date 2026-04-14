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
      "MISSING_REQUIRED_FIELD",
    ],
  );
  assert.deepEqual(
    result.error.details.map((detail) => detail.field),
    ["developmentHoursPerDay", "sprintDurationDays", "storyPoints", "pointValue"],
  );
});

test("validation: blocks non-positive values to prevent invalid divisions", () => {
  const result = calculateSprintValueUseCase({
    developers: 0,
    developmentHoursPerDay: -1,
    sprintDurationDays: 10,
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

test("validation: rejects missing sprintDurationDays", () => {
  const result = calculateSprintValueUseCase({
    developers: 7,
    developmentHoursPerDay: 6,
    storyPoints: 55,
    pointValue: 4,
  });

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "VALIDATION_ERROR");
  assert.deepEqual(
    result.error.details.map((detail) => detail.field),
    ["sprintDurationDays"],
  );
  assert.deepEqual(
    result.error.details.map((detail) => detail.code),
    ["MISSING_REQUIRED_FIELD"],
  );
});

test("validation: rejects non-positive sprintDurationDays", () => {
  const result = calculateSprintValueUseCase({
    developers: 7,
    developmentHoursPerDay: 6,
    sprintDurationDays: 0,
    storyPoints: 55,
    pointValue: 4,
  });

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "VALIDATION_ERROR");
  assert.deepEqual(
    result.error.details.map((detail) => detail.field),
    ["sprintDurationDays"],
  );
  assert.deepEqual(
    result.error.details.map((detail) => detail.code),
    ["NON_POSITIVE_VALUE"],
  );
});

test("validation: rejects negative sprintDurationDays", () => {
  const result = calculateSprintValueUseCase({
    developers: 7,
    developmentHoursPerDay: 6,
    sprintDurationDays: -5,
    storyPoints: 55,
    pointValue: 4,
  });

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "VALIDATION_ERROR");
  assert.deepEqual(
    result.error.details.map((detail) => detail.field),
    ["sprintDurationDays"],
  );
  assert.deepEqual(
    result.error.details.map((detail) => detail.code),
    ["NON_POSITIVE_VALUE"],
  );
});

test("validation: accepts valid input with all required fields", () => {
  const result = calculateSprintValueUseCase({
    developers: 7,
    developmentHoursPerDay: 6,
    sprintDurationDays: 10,
    storyPoints: 55,
    pointValue: 4,
  });

  assert.equal(result.ok, true);
  
  // Verify new output structure exists
  assert.ok(result.data.output.totalSprintCapacity);
  assert.ok(result.data.output.totalDailyCapacity);
  assert.ok(result.data.output.functionalDevs);
  assert.ok(result.data.output.functionalSprintCapacity);
  assert.ok(result.data.output.functionalDailyCapacity);
  assert.ok(result.data.output.baseStoryEffort);
  assert.ok(result.data.output.refinedStoryEffort);
  assert.ok(result.data.output.requiredStoryDays);
  assert.ok(result.data.output.sprintDurationDays);
  assert.ok(result.data.output.fitsInSprint);
  assert.ok(result.data.output.remainingDays);
});

test("validation: output contains correct field structure with label and value", () => {
  const result = calculateSprintValueUseCase({
    developers: 7,
    developmentHoursPerDay: 6,
    sprintDurationDays: 10,
    storyPoints: 55,
    pointValue: 4,
    hasRnf: true,
  });

  assert.equal(result.ok, true);
  
  // Check that all output fields have proper structure
  assert.ok(result.data.output.totalSprintCapacity.label);
  assert.ok(result.data.output.totalSprintCapacity.formula);
  assert.equal(typeof result.data.output.totalSprintCapacity.value, "number");
  
  assert.ok(result.data.output.totalDailyCapacity.label);
  assert.equal(typeof result.data.output.totalDailyCapacity.value, "number");
  
  assert.ok(result.data.output.baseStoryEffort.label);
  assert.equal(typeof result.data.output.baseStoryEffort.value, "number");
  
  assert.ok(result.data.output.requiredStoryDays.label);
  assert.equal(typeof result.data.output.requiredStoryDays.value, "number");
  assert.equal(typeof result.data.output.requiredStoryDays.raw, "number");
  
  assert.ok(result.data.output.fitsInSprint.label);
  assert.equal(typeof result.data.output.fitsInSprint.value, "boolean");
});

test("validation: RNF fields present only when hasRnf=true and allocated", () => {
  const withRnf = calculateSprintValueUseCase({
    developers: 7,
    developmentHoursPerDay: 6,
    sprintDurationDays: 10,
    storyPoints: 55,
    pointValue: 4,
    hasRnf: true,
  });

  const withoutRnf = calculateSprintValueUseCase({
    developers: 7,
    developmentHoursPerDay: 6,
    sprintDurationDays: 10,
    storyPoints: 55,
    pointValue: 4,
    hasRnf: false,
  });

  assert.equal(withRnf.ok, true);
  assert.equal(withoutRnf.ok, true);
  
  // With RNF: fields should be present
  assert.ok(withRnf.data.output.rnfTargetHours);
  assert.ok(withRnf.data.output.rnfAllocatedDevs);
  assert.ok(withRnf.data.output.rnfAllocatedHours);
  assert.ok(withRnf.data.output.rnfPercentageActual);
  
  // Without RNF: fields should be undefined
  assert.equal(withoutRnf.data.output.rnfTargetHours, undefined);
  assert.equal(withoutRnf.data.output.rnfAllocatedDevs, undefined);
  assert.equal(withoutRnf.data.output.rnfAllocatedHours, undefined);
  assert.equal(withoutRnf.data.output.rnfPercentageActual, undefined);
});
