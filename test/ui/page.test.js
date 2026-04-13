import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import { calculateSprintValueAdapter } from "../../src/index.js";

test("ui contract: adapter returns result metadata for the Vue page", () => {
  const result = calculateSprintValueAdapter(
    {
      developers: 7,
      developmentHoursPerDay: 6,
      storyPoints: 55,
      pointValue: 4,
    },
    { technicalRefinementHours: 26, rnfDeveloperCount: 2 },
  );

  assert.equal(result.ok, true);
  assert.equal(result.data.output.dailyCapacity.label, "Capacidade diaria");
  assert.equal(result.data.output.rnfHours.value, 74);
});

test("ui markup: page shell includes Vue and Stitch-aligned sections", () => {
  const html = fs.readFileSync(path.join(process.cwd(), "index.html"), "utf8");
  const app = fs.readFileSync(path.join(process.cwd(), "app.js"), "utf8");

  assert.match(html, /id="app"/);
  assert.match(app, /createApp/);
  assert.match(app, /technicalRefinementHours/);
  assert.match(app, /rnfDeveloperCount/);
});
