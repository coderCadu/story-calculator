import test from "node:test";
import assert from "node:assert/strict";

import { calculateSprintMetrics } from "../../src/domain/services/sprintMetricsCalculator.js";

// Tasks 6.9-6.10: Test complete pipeline integration

test("complete pipeline with hasRnf=true: full three-phase calculation", () => {
  const result = calculateSprintMetrics(
    {
      developers: 7,
      developmentHoursPerDay: 6,
      sprintDurationDays: 10,
      hasRnf: true,
      storyPoints: 55,
      pointValue: 4,
    },
    {
      technicalRefinementHours: 26,
      rnfPercentage: 30,
    }
  );

  // Phase 1: Sprint Capacity
  assert.equal(result.totalSprintCapacity, 420);
  assert.equal(result.totalDailyCapacity, 42);
  assert.equal(result.rnfAllocatedDevs, 2);
  assert.equal(result.rnfAllocatedHours, 120);
  assert.equal(result.rnfPercentageActual, 28.57);
  assert.equal(result.functionalDevs, 5);
  assert.equal(result.functionalSprintCapacity, 300);
  assert.equal(result.functionalDailyCapacity, 30);

  // Phase 2: Story Effort
  assert.equal(result.baseStoryEffort, 220);
  assert.equal(result.technicalRefinementHours, 26);
  assert.equal(result.refinedStoryEffort, 246);

  // Phase 3: Integration
  assert.equal(result.rawRequiredDays, 8.19);
  assert.equal(result.roundedRequiredDays, 9);
  assert.equal(result.sprintDurationDays, 10);
  assert.equal(result.fitsInSprint, true);
  assert.equal(result.remainingDays, 1);
});

test("complete pipeline with hasRnf=false: no RNF allocation", () => {
  const result = calculateSprintMetrics(
    {
      developers: 7,
      developmentHoursPerDay: 6,
      sprintDurationDays: 10,
      hasRnf: false,
      storyPoints: 55,
      pointValue: 4,
    },
    {
      technicalRefinementHours: 26,
      rnfPercentage: 30,
    }
  );

  // Phase 1: Sprint Capacity (no RNF)
  assert.equal(result.totalSprintCapacity, 420);
  assert.equal(result.totalDailyCapacity, 42);
  assert.equal(result.rnfAllocatedDevs, undefined);
  assert.equal(result.rnfAllocatedHours, undefined);
  assert.equal(result.functionalDevs, 7);
  assert.equal(result.functionalSprintCapacity, 420);
  assert.equal(result.functionalDailyCapacity, 42);

  // Phase 2: Story Effort (same as hasRnf=true)
  assert.equal(result.baseStoryEffort, 220);
  assert.equal(result.technicalRefinementHours, 26);
  assert.equal(result.refinedStoryEffort, 246);

  // Phase 3: Integration (using full capacity)
  assert.equal(result.rawRequiredDays, 5.85);
  assert.equal(result.roundedRequiredDays, 6);
  assert.equal(result.sprintDurationDays, 10);
  assert.equal(result.fitsInSprint, true);
  assert.equal(result.remainingDays, 4);
});

test("integration: small team with hasRnf=true → RNF not allocated", () => {
  const result = calculateSprintMetrics(
    {
      developers: 2,
      developmentHoursPerDay: 6,
      sprintDurationDays: 10,
      hasRnf: true,
      storyPoints: 20,
      pointValue: 3,
    },
    {
      technicalRefinementHours: 15,
      rnfPercentage: 30,
    }
  );

  // Phase 1: RNF allocation fails (team too small)
  assert.equal(result.totalSprintCapacity, 120);
  assert.equal(result.rnfAllocatedDevs, undefined);
  assert.equal(result.functionalDevs, 2);
  assert.equal(result.functionalDailyCapacity, 12);

  // Phase 2: Story Effort
  assert.equal(result.baseStoryEffort, 60);
  assert.equal(result.refinedStoryEffort, 75);

  // Phase 3: Integration
  assert.equal(result.rawRequiredDays, 6.25);
  assert.equal(result.roundedRequiredDays, 7);
  assert.equal(result.fitsInSprint, true);
  assert.equal(result.remainingDays, 3);
});

test("integration: overcommitted sprint doesn't fit", () => {
  const result = calculateSprintMetrics(
    {
      developers: 5,
      developmentHoursPerDay: 8,
      sprintDurationDays: 10,
      hasRnf: true,
      storyPoints: 150,
      pointValue: 5,
    },
    {
      technicalRefinementHours: 50,
      rnfPercentage: 30,
    }
  );

  // Phase 1: Capacity with RNF
  assert.equal(result.totalSprintCapacity, 400);
  assert.equal(result.rnfAllocatedDevs, 1);
  assert.equal(result.rnfAllocatedHours, 80);
  assert.equal(result.functionalDevs, 4);
  assert.equal(result.functionalDailyCapacity, 32);

  // Phase 2: Story Effort
  assert.equal(result.baseStoryEffort, 750);
  assert.equal(result.refinedStoryEffort, 800);

  // Phase 3: Doesn't fit
  assert.equal(result.rawRequiredDays, 25.00);
  assert.equal(result.roundedRequiredDays, 25);
  assert.equal(result.fitsInSprint, false);
  assert.equal(result.remainingDays, -15);
});

test("integration: exact boundary fit after rounding", () => {
  const result = calculateSprintMetrics(
    {
      developers: 10,
      developmentHoursPerDay: 10,
      sprintDurationDays: 10,
      hasRnf: true,
      storyPoints: 100,
      pointValue: 7,
    },
    {
      technicalRefinementHours: 0,
      rnfPercentage: 30,
    }
  );

  // Phase 1: Capacity
  assert.equal(result.totalSprintCapacity, 1000);
  assert.equal(result.rnfAllocatedDevs, 3);
  assert.equal(result.functionalDevs, 7);
  assert.equal(result.functionalDailyCapacity, 70);

  // Phase 2: Story Effort
  assert.equal(result.baseStoryEffort, 700);
  assert.equal(result.refinedStoryEffort, 700);

  // Phase 3: Perfect fit
  assert.equal(result.rawRequiredDays, 10.00);
  assert.equal(result.roundedRequiredDays, 10);
  assert.equal(result.fitsInSprint, true);
  assert.equal(result.remainingDays, 0);
});

test("integration: custom technical refinement override", () => {
  const result = calculateSprintMetrics(
    {
      developers: 8,
      developmentHoursPerDay: 7,
      sprintDurationDays: 12,
      hasRnf: true,
      storyPoints: 60,
      pointValue: 5,
    },
    {
      technicalRefinementHours: 50, // Custom override
      rnfPercentage: 30,
    }
  );

  // Phase 1: Capacity
  assert.equal(result.totalSprintCapacity, 672);
  assert.equal(result.rnfAllocatedDevs, 2);
  assert.equal(result.functionalDevs, 6);
  assert.equal(result.functionalDailyCapacity, 42);

  // Phase 2: Story Effort with custom refinement
  assert.equal(result.baseStoryEffort, 300);
  assert.equal(result.technicalRefinementHours, 50);
  assert.equal(result.refinedStoryEffort, 350);

  // Phase 3: Integration
  assert.equal(result.rawRequiredDays, 8.33);
  assert.equal(result.roundedRequiredDays, 9);
  assert.equal(result.fitsInSprint, true);
  assert.equal(result.remainingDays, 3);
});

test("integration: hasRnf defaults to false when omitted", () => {
  const result = calculateSprintMetrics(
    {
      developers: 7,
      developmentHoursPerDay: 6,
      sprintDurationDays: 10,
      // hasRnf omitted - defaults to false
      storyPoints: 55,
      pointValue: 4,
    },
    {
      technicalRefinementHours: 26,
      rnfPercentage: 30,
    }
  );

  // Should behave like hasRnf=false
  assert.equal(result.rnfAllocatedDevs, undefined);
  assert.equal(result.functionalDevs, 7);
  assert.equal(result.functionalDailyCapacity, 42);
  assert.equal(result.rawRequiredDays, 5.85);
});

test("integration: zero story points edge case", () => {
  const result = calculateSprintMetrics(
    {
      developers: 5,
      developmentHoursPerDay: 8,
      sprintDurationDays: 10,
      hasRnf: true,
      storyPoints: 0,
      pointValue: 4,
    },
    {
      technicalRefinementHours: 26,
      rnfPercentage: 30,
    }
  );

  // Phase 1: Capacity
  assert.equal(result.totalSprintCapacity, 400);
  assert.equal(result.functionalDevs, 4);
  assert.equal(result.functionalDailyCapacity, 32);

  // Phase 2: Only refinement effort
  assert.equal(result.baseStoryEffort, 0);
  assert.equal(result.refinedStoryEffort, 26);

  // Phase 3: Minimal required days
  assert.equal(result.rawRequiredDays, 0.81);
  assert.equal(result.roundedRequiredDays, 1);
  assert.equal(result.fitsInSprint, true);
  assert.equal(result.remainingDays, 9);
});
