## Why

The calculator's checkbox input currently lacks visual consistency with the Material Design dark theme used throughout the interface. Additionally, the base story effort metric is calculated internally but not exposed in the output, limiting visibility into the calculation breakdown for users who want to understand effort before technical refinement is applied.

## What Changes

- Style the RNF checkbox to match the Material Design dark theme with rounded borders, consistent hover states, and proper focus indicators
- Add `baseStoryEffort` to the output contract of the sprint value calculation, making it visible in the results dashboard alongside other metrics
- Update UI to display the new `baseStoryEffort` metric in the Story Analysis section of the results dashboard

## Capabilities

### New Capabilities

<!-- No new capabilities being introduced -->

### Modified Capabilities

- `vue-stitch-sprint-page`: Update checkbox styling to use Material Design dark theme with rounded borders and consistent visual treatment
- `sprint-value-calculation`: Add `baseStoryEffort` to the output contract (already calculated internally, now explicitly exposed)

## Impact

**Files affected:**
- `styles.css`: New checkbox styles for Material Design dark theme
- `app.js`: UI template may need minor updates to display new metric
- `src/application/contracts/sprintCalculationContracts.js`: Add `baseStoryEffort` to output structure (already exists internally, just needs to be exposed)
- `test/ui/page.test.js`: UI tests for checkbox styling
- `test/application/calculateSprintValue.acceptance.test.js`: Verify `baseStoryEffort` appears in output

**Dependencies:**
- No external dependencies affected
- No breaking changes to existing APIs or contracts (additive change only)
