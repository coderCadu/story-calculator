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
