import test from "node:test";
import assert from "node:assert/strict";

import { calculateSprintCapacity } from "../../src/domain/services/sprintCapacityCalculator.js";

// Tasks 6.1-6.4: Test RNF allocation algorithm

test("normal allocation: 7 devs, 6h/day, 10 days → 2 RNF devs, 120h allocated", () => {
  const result = calculateSprintCapacity(
    {
      developers: 7,
      developmentHoursPerDay: 6,
      sprintDurationDays: 10,
    },
    true
  );

  assert.equal(result.totalSprintCapacity, 420);
  assert.equal(result.totalDailyCapacity, 42);
  assert.equal(result.rnfAllocatedDevs, 2);
  assert.equal(result.rnfAllocatedHours, 120);
  assert.equal(result.rnfPercentageActual, 28.57);
  assert.equal(result.functionalDevs, 5);
  assert.equal(result.functionalSprintCapacity, 300);
  assert.equal(result.functionalDailyCapacity, 30);
});

test("small team: 2 devs, 6h/day, 10 days → 0 RNF devs (not feasible)", () => {
  const result = calculateSprintCapacity(
    {
      developers: 2,
      developmentHoursPerDay: 6,
      sprintDurationDays: 10,
    },
    true
  );

  assert.equal(result.totalSprintCapacity, 120);
  assert.equal(result.totalDailyCapacity, 12);
  // Smart omission: No RNF fields when allocation = 0
  assert.equal(result.rnfAllocatedDevs, undefined);
  assert.equal(result.rnfAllocatedHours, undefined);
  assert.equal(result.rnfPercentageActual, undefined);
  assert.equal(result.functionalDevs, 2);
  assert.equal(result.functionalSprintCapacity, 120);
  assert.equal(result.functionalDailyCapacity, 12);
});

test("single dev: 1 dev, 6h/day, 10 days → 0 RNF devs", () => {
  const result = calculateSprintCapacity(
    {
      developers: 1,
      developmentHoursPerDay: 6,
      sprintDurationDays: 10,
    },
    true
  );

  assert.equal(result.totalSprintCapacity, 60);
  assert.equal(result.totalDailyCapacity, 6);
  // Smart omission: No RNF fields when allocation = 0
  assert.equal(result.rnfAllocatedDevs, undefined);
  assert.equal(result.rnfAllocatedHours, undefined);
  assert.equal(result.rnfPercentageActual, undefined);
  assert.equal(result.functionalDevs, 1);
  assert.equal(result.functionalSprintCapacity, 60);
  assert.equal(result.functionalDailyCapacity, 6);
});

test("exact 30% match: 10 devs, 10h/day, 10 days → 3 RNF devs, 300h allocated (30%)", () => {
  const result = calculateSprintCapacity(
    {
      developers: 10,
      developmentHoursPerDay: 10,
      sprintDurationDays: 10,
    },
    true
  );

  assert.equal(result.totalSprintCapacity, 1000);
  assert.equal(result.rnfAllocatedDevs, 3);
  assert.equal(result.rnfAllocatedHours, 300);
  assert.equal(result.rnfPercentageActual, 30.00);
  assert.equal(result.functionalDevs, 7);
  assert.equal(result.functionalSprintCapacity, 700);
});

test("allocation at boundary: 3 devs, 8h/day, 10 days → 0 RNF devs (boundary)", () => {
  const result = calculateSprintCapacity(
    {
      developers: 3,
      developmentHoursPerDay: 8,
      sprintDurationDays: 10,
    },
    true
  );

  // Total capacity = 240h, 30% target = 72h
  // 1 dev = 80h (too much), so 0 devs allocated
  assert.equal(result.totalSprintCapacity, 240);
  assert.equal(result.rnfAllocatedDevs, undefined);
  assert.equal(result.functionalDevs, 3);
  assert.equal(result.functionalSprintCapacity, 240);
});

test("maximum constraint: large team → respects totalDevs - 1 limit", () => {
  const result = calculateSprintCapacity(
    {
      developers: 20,
      developmentHoursPerDay: 8,
      sprintDurationDays: 10,
    },
    true
  );

  // Total capacity = 1600h, 30% target = 480h
  // 1 dev capacity = 80h, ideal = 6 devs
  assert.equal(result.totalSprintCapacity, 1600);
  assert.equal(result.rnfAllocatedDevs, 6);
  assert.equal(result.rnfAllocatedHours, 480);
  assert.equal(result.rnfPercentageActual, 30.00);
  assert.equal(result.functionalDevs, 14);
});

test("smart omission: RNF fields present when allocation > 0", () => {
  const result = calculateSprintCapacity(
    {
      developers: 7,
      developmentHoursPerDay: 6,
      sprintDurationDays: 10,
    },
    true
  );

  // Should have all RNF fields
  assert.ok(result.rnfTargetHours !== undefined);
  assert.ok(result.rnfAllocatedDevs !== undefined);
  assert.ok(result.rnfAllocatedHours !== undefined);
  assert.ok(result.rnfPercentageActual !== undefined);
});

test("smart omission: RNF fields omitted when allocation = 0", () => {
  const result = calculateSprintCapacity(
    {
      developers: 1,
      developmentHoursPerDay: 6,
      sprintDurationDays: 10,
    },
    true
  );

  // Should NOT have RNF fields
  assert.equal(result.rnfTargetHours, undefined);
  assert.equal(result.rnfAllocatedDevs, undefined);
  assert.equal(result.rnfAllocatedHours, undefined);
  assert.equal(result.rnfPercentageActual, undefined);
});

test("hasRnf=false: no RNF allocation regardless of team size", () => {
  const result = calculateSprintCapacity(
    {
      developers: 10,
      developmentHoursPerDay: 8,
      sprintDurationDays: 10,
    },
    false
  );

  assert.equal(result.totalSprintCapacity, 800);
  assert.equal(result.totalDailyCapacity, 80);
  assert.equal(result.rnfAllocatedDevs, undefined);
  assert.equal(result.rnfAllocatedHours, undefined);
  assert.equal(result.functionalDevs, 10);
  assert.equal(result.functionalSprintCapacity, 800);
  assert.equal(result.functionalDailyCapacity, 80);
});

test("edge case: 4 devs at threshold → 1 RNF dev allocated", () => {
  const result = calculateSprintCapacity(
    {
      developers: 4,
      developmentHoursPerDay: 8,
      sprintDurationDays: 10,
    },
    true
  );

  // Total = 320h, 30% target = 96h, 1 dev = 80h (feasible)
  assert.equal(result.totalSprintCapacity, 320);
  assert.equal(result.rnfAllocatedDevs, 1);
  assert.equal(result.rnfAllocatedHours, 80);
  assert.equal(result.rnfPercentageActual, 25.00);
  assert.equal(result.functionalDevs, 3);
  assert.equal(result.functionalSprintCapacity, 240);
});
