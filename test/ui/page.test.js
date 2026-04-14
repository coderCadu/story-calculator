import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import { calculateSprintValueAdapter } from "../../src/index.js";

test("ui contract: adapter returns new output structure with RNF allocation", () => {
  const result = calculateSprintValueAdapter(
    {
      developers: 7,
      developmentHoursPerDay: 6,
      sprintDurationDays: 10,
      hasRnf: true,
      storyPoints: 55,
      pointValue: 4,
    },
    { technicalRefinementHours: 26 },
  );

  assert.equal(result.ok, true);

  // Verify new capacity fields
  assert.equal(result.data.output.totalDailyCapacity.value, 42);
  assert.equal(result.data.output.totalSprintCapacity.value, 420);

  // Verify RNF allocation fields (conditional)
  assert.equal(result.data.output.rnfAllocatedDevs.value, 2);
  assert.equal(result.data.output.rnfAllocatedHours.value, 120);

  // Verify functional capacity fields
  assert.equal(result.data.output.functionalDevs.value, 5);
  assert.equal(result.data.output.functionalDailyCapacity.value, 30);

  // Verify new story effort fields
  assert.equal(result.data.output.baseStoryEffort.value, 220);
  assert.equal(result.data.output.refinedStoryEffort.value, 246);
});

test("ui contract: adapter returns output without RNF fields when hasRnf=false", () => {
  const result = calculateSprintValueAdapter(
    {
      developers: 7,
      developmentHoursPerDay: 6,
      sprintDurationDays: 10,
      hasRnf: false,
      storyPoints: 55,
      pointValue: 4,
    },
    { technicalRefinementHours: 26 },
  );

  assert.equal(result.ok, true);

  // RNF fields should not be present
  assert.equal(result.data.output.rnfTargetHours, undefined);
  assert.equal(result.data.output.rnfAllocatedDevs, undefined);
  assert.equal(result.data.output.rnfAllocatedHours, undefined);

  // All developers are functional
  assert.equal(result.data.output.functionalDevs.value, 7);
  assert.equal(result.data.output.functionalDailyCapacity.value, 42);
});

test("ui markup: page shell includes Vue app mount point", () => {
  const html = fs.readFileSync(path.join(process.cwd(), "index.html"), "utf8");
  const app = fs.readFileSync(path.join(process.cwd(), "app.js"), "utf8");

  assert.match(html, /id="app"/);
  assert.match(app, /createApp/);
  assert.match(app, /\.mount\("#app"\)/);
});

test("ui markup: form includes new input fields for sprint duration and RNF toggle", () => {
  const app = fs.readFileSync(path.join(process.cwd(), "app.js"), "utf8");

  // Check new fields exist in form data
  assert.match(app, /sprintDurationDays:\s*10/);
  assert.match(app, /hasRnf:\s*false/);

  // Check new fields in template
  assert.match(app, /v-model\.number="form\.sprintDurationDays"/);
  assert.match(app, /v-model="form\.hasRnf"/);
  assert.match(app, /type="checkbox"/);

  // Verify old rnfDeveloperCount field is removed
  assert.doesNotMatch(app, /rnfDeveloperCount/);
});

test("ui markup: form is separated into Sprint Setup and Story Sizing sections", () => {
  const app = fs.readFileSync(path.join(process.cwd(), "app.js"), "utf8");

  // Check for section headings
  assert.match(app, /<h3>Sprint Setup<\/h3>/);
  assert.match(app, /<h3>Story Sizing<\/h3>/);

  // Check CSS classes for sections
  assert.match(app, /<div class="form-section">/);
});

test("ui markup: dashboard has integrated sections for capacity, story, and RNF", () => {
  const app = fs.readFileSync(path.join(process.cwd(), "app.js"), "utf8");

  // Check for dashboard structure
  assert.match(app, /<div.*class="results-dashboard">/);
  assert.match(app, /<div class="dashboard-section">/);

  // Check for section headings
  assert.match(app, /<h3>Sprint Capacity<\/h3>/);
  assert.match(app, /<h3>Story Analysis<\/h3>/);
  assert.match(app, /<h3>RNF Allocation<\/h3>/);

  // Check heading says "Dashboard integrado"
  assert.match(app, /<h2>Dashboard integrado<\/h2>/);
});

test("ui markup: RNF section displays conditionally based on allocation", () => {
  const app = fs.readFileSync(path.join(process.cwd(), "app.js"), "utf8");

  // Check for conditional rendering of RNF section
  assert.match(
    app,
    /v-if="hasRnfMetrics"/,
  );
});

test("ui markup: RNF allocated devs shows lock indicator", () => {
  const app = fs.readFileSync(path.join(process.cwd(), "app.js"), "utf8");

  // Check for lock indicator on allocated metrics
  assert.match(
    app,
    /v-if="metric\.isAllocated">🔒 <\/span>/,
  );
});

test("ui markup: checkbox has Material Design styling with .checkbox-label class", () => {
  const app = fs.readFileSync(path.join(process.cwd(), "app.js"), "utf8");
  const css = fs.readFileSync(path.join(process.cwd(), "styles.css"), "utf8");

  // Check checkbox is wrapped in .checkbox-label
  assert.match(app, /<label class="checkbox-label">/);
  
  // Check CSS has checkbox styling
  assert.match(css, /\.checkbox-label/);
  assert.match(css, /\.checkbox-label input\[type="checkbox"\]/);
  
  // Verify Material Design features: rounded borders, transitions, states
  assert.match(css, /border-radius:\s*var\(--radius-\w+\)/);
  assert.match(css, /transition:/);
});

test("ui markup: checkbox label is properly associated with input", () => {
  const app = fs.readFileSync(path.join(process.cwd(), "app.js"), "utf8");

  // Check checkbox and label are in same label element
  assert.match(app, /<label class="checkbox-label">[\s\S]*?<input[^>]*type="checkbox"[^>]*>[\s\S]*?<span>Incluir RNF<\/span>[\s\S]*?<\/label>/);
});

test("ui contract: baseStoryEffort calculation is correct", () => {
  const result = calculateSprintValueAdapter(
    {
      developers: 5,
      developmentHoursPerDay: 8,
      sprintDurationDays: 10,
      hasRnf: false,
      storyPoints: 13,
      pointValue: 5,
    },
    { technicalRefinementHours: 10 },
  );

  assert.equal(result.ok, true);
  
  // Verify baseStoryEffort equals storyPoints × pointValue
  assert.equal(result.data.output.baseStoryEffort.value, 65); // 13 × 5
  assert.equal(result.data.output.baseStoryEffort.label, "Esforço base da história");
  assert.equal(result.data.output.baseStoryEffort.formula, "storyPoints * pointValue");
});
