import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

test("architecture: adapter orchestrates I/O and does not implement formulas", () => {
  const adapterPath = path.join(
    root,
    "src/adapters/inbound/calculateSprintValueAdapter.js",
  );
  const adapterSource = fs.readFileSync(adapterPath, "utf8");

  assert.match(adapterSource, /calculateSprintValueUseCase/);
  assert.doesNotMatch(adapterSource, /storyPoints\s*\*/);
  assert.doesNotMatch(adapterSource, /developers\s*\*/);
  assert.doesNotMatch(adapterSource, /Math\.ceil|Math\.round/);
});

test("architecture: formulas are centralized in domain service", () => {
  const domainPath = path.join(
    root,
    "src/domain/services/sprintValueCalculator.js",
  );
  const domainSource = fs.readFileSync(domainPath, "utf8");

  assert.match(domainSource, /developers \* input\.developmentHoursPerDay/);
  assert.match(domainSource, /input\.storyPoints \* input\.pointValue/);
  assert.match(domainSource, /Math\.ceil/);
  assert.match(domainSource, /Math\.round/);
});

test("architecture: domain services have no dependencies on application layer", () => {
  const domainServices = [
    "sprintCapacityCalculator.js",
    "storyEffortCalculator.js",
    "sprintIntegrationCalculator.js",
    "sprintMetricsCalculator.js",
  ];

  domainServices.forEach((serviceName) => {
    const servicePath = path.join(root, "src/domain/services", serviceName);
    const serviceSource = fs.readFileSync(servicePath, "utf8");

    // Domain services should not import from application or adapter layers
    assert.doesNotMatch(
      serviceSource,
      /from\s+["'].*\/application\//,
      `${serviceName} should not depend on application layer`,
    );
    assert.doesNotMatch(
      serviceSource,
      /from\s+["'].*\/adapters\//,
      `${serviceName} should not depend on adapters layer`,
    );
  });
});

test("architecture: domain services contain mathematical formulas", () => {
  const sprintCapacityPath = path.join(
    root,
    "src/domain/services/sprintCapacityCalculator.js",
  );
  const sprintCapacitySource = fs.readFileSync(sprintCapacityPath, "utf8");

  // sprintCapacityCalculator should have mathematical operations
  assert.match(sprintCapacitySource, /Math\.floor|Math\.ceil|Math\.trunc/);
  assert.match(sprintCapacitySource, /totalDevs \* hoursPerDay \* sprintDays/);

  const storyEffortPath = path.join(
    root,
    "src/domain/services/storyEffortCalculator.js",
  );
  const storyEffortSource = fs.readFileSync(storyEffortPath, "utf8");

  // storyEffortCalculator should have formula for story effort
  assert.match(storyEffortSource, /storyPoints \* pointValue/);
  assert.match(
    storyEffortSource,
    /baseStoryEffort \+ technicalRefinementHours/,
  );
});
