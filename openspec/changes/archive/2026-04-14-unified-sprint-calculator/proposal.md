## Why

The current sprint calculator only provides bottom-up estimation (story points → required days). Teams need both perspectives: top-down sprint capacity planning and bottom-up story estimation. This unified approach enables teams to see total sprint capacity, automatically allocate RNF resources, and validate whether stories fit within sprint boundaries.

## What Changes

- Add **sprint duration** as a required input field to enable capacity calculations
- Add **hasRnf** checkbox to optionally enable RNF allocation (default: false)
- **Auto-calculate RNF developer allocation** using mathematical optimization (≤30% of capacity) instead of manual input
- Calculate **sprint capacity** (total, RNF, and functional) as top-down view
- Calculate **sprint fit analysis** (whether story fits, remaining days)
- Refactor domain into **composed pipeline** with separate calculators for capacity, effort, and integration
- **BREAKING**: Remove manual `rnfDeveloperCount` input (now auto-calculated)
- **BREAKING**: Rename output fields: `dailyCapacity` → `totalDailyCapacity`, `totalStoryEffort` → `baseStoryEffort`
- **BREAKING**: Remove RNF-related output fields: `rawRnfHours`, `roundedRnfHours`, `rnfDailyCapacity`, `rawRnfDays`, `roundedRnfDays`
- **BREAKING**: Add new output fields for sprint capacity metrics and fit analysis
- Smart output omission: RNF fields only appear when allocation succeeds (≥1 dev allocated)
- Update UI with separated sections: "Sprint Setup" and "Story Sizing"
- Update UI results with integrated dashboard showing both capacity and story views
- Set default values: `pointValue=4`, `technicalRefinementHours=26`, `hasRnf=false`

## Capabilities

### New Capabilities

- `sprint-capacity-calculation`: Calculate total sprint capacity and auto-allocate RNF developers using mathematical optimization to achieve ≤30% allocation
- `sprint-integration-analysis`: Integrate capacity and story metrics to determine sprint fit, remaining days, and validate feasibility

### Modified Capabilities

- `sprint-value-calculation`: Refactor to use functional developer count (after RNF subtraction) and add sprint capacity concepts
- `vue-stitch-sprint-page`: Update UI to support sprint duration input, RNF checkbox, separated form sections, and integrated capacity/story dashboard

## Impact

**Domain Layer**:
- New: `sprintCapacityCalculator.js`, `storyEffortCalculator.js`, `sprintIntegrationCalculator.js`, `sprintMetricsCalculator.js`
- Modified: `calculationPolicy.js` (remove `rnfDeveloperCount`)

**Application Layer**:
- Modified: `calculateSprintValue.js` (use new orchestrator)
- Modified: `sprintCalculationContracts.js` (new output shape)

**Adapter Layer**:
- Modified: `calculateSprintValueAdapter.js` (accept new inputs)

**UI**:
- Modified: `app.js` (new form fields, defaults, separated sections)
- Potentially: `index.html`, `styles.css`

**Tests**:
- New: Unit tests for all new calculators
- Modified: All existing tests (acceptance, validation, architecture, UI)
- Breaking: All expected values change due to new calculation model
