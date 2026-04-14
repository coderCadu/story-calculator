import test from "node:test";
import assert from "node:assert/strict";

import { calculateStoryEffort } from "../../src/domain/services/storyEffortCalculator.js";

// Tasks 6.5-6.6: Test story effort calculation

test("base story effort calculation: 55 points × 4 hours/point = 220h", () => {
  const result = calculateStoryEffort(
    {
      storyPoints: 55,
      pointValue: 4,
    },
    {
      technicalRefinementHours: 0,
    }
  );

  assert.equal(result.baseStoryEffort, 220);
  assert.equal(result.technicalRefinementHours, 0);
  assert.equal(result.refinedStoryEffort, 220);
});

test("technical refinement with default (26h): 220h + 26h = 246h", () => {
  const result = calculateStoryEffort(
    {
      storyPoints: 55,
      pointValue: 4,
    },
    {
      technicalRefinementHours: 26,
    }
  );

  assert.equal(result.baseStoryEffort, 220);
  assert.equal(result.technicalRefinementHours, 26);
  assert.equal(result.refinedStoryEffort, 246);
});

test("technical refinement override: custom 40h refinement", () => {
  const result = calculateStoryEffort(
    {
      storyPoints: 100,
      pointValue: 3,
    },
    {
      technicalRefinementHours: 40,
    }
  );

  assert.equal(result.baseStoryEffort, 300);
  assert.equal(result.technicalRefinementHours, 40);
  assert.equal(result.refinedStoryEffort, 340);
});

test("zero story points: 0 points × 4 hours/point = 0h (edge case)", () => {
  const result = calculateStoryEffort(
    {
      storyPoints: 0,
      pointValue: 4,
    },
    {
      technicalRefinementHours: 26,
    }
  );

  assert.equal(result.baseStoryEffort, 0);
  assert.equal(result.technicalRefinementHours, 26);
  assert.equal(result.refinedStoryEffort, 26);
});

test("large story backlog: 200 points × 5 hours/point + 50h refinement", () => {
  const result = calculateStoryEffort(
    {
      storyPoints: 200,
      pointValue: 5,
    },
    {
      technicalRefinementHours: 50,
    }
  );

  assert.equal(result.baseStoryEffort, 1000);
  assert.equal(result.technicalRefinementHours, 50);
  assert.equal(result.refinedStoryEffort, 1050);
});

test("fractional point values: 10 points × 2.5 hours/point", () => {
  const result = calculateStoryEffort(
    {
      storyPoints: 10,
      pointValue: 2.5,
    },
    {
      technicalRefinementHours: 10,
    }
  );

  assert.equal(result.baseStoryEffort, 25);
  assert.equal(result.technicalRefinementHours, 10);
  assert.equal(result.refinedStoryEffort, 35);
});

test("negative refinement (credit): 100h - 20h credit = 80h", () => {
  const result = calculateStoryEffort(
    {
      storyPoints: 25,
      pointValue: 4,
    },
    {
      technicalRefinementHours: -20,
    }
  );

  assert.equal(result.baseStoryEffort, 100);
  assert.equal(result.technicalRefinementHours, -20);
  assert.equal(result.refinedStoryEffort, 80);
});
