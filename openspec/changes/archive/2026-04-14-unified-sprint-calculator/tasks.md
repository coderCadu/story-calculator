## 1. Create Domain Services

- [x] 1.1 Create `src/domain/services/sprintCapacityCalculator.js` with `allocateRnfDevelopers` helper and `calculateSprintCapacity` function
- [x] 1.2 Implement mathematical RNF allocation algorithm using `floor(rnfTarget / devCapacity)` with constraints
- [x] 1.3 Implement smart output omission logic (omit RNF fields when allocation = 0)
- [x] 1.4 Create `src/domain/services/storyEffortCalculator.js` with `calculateStoryEffort` function
- [x] 1.5 Extract story effort calculation logic from existing calculator
- [x] 1.6 Create `src/domain/services/sprintIntegrationCalculator.js` with `calculateSprintIntegration` function
- [x] 1.7 Implement sprint fit analysis (fitsInSprint, remainingDays) in integration calculator
- [x] 1.8 Create `src/domain/services/sprintMetricsCalculator.js` as main orchestrator
- [x] 1.9 Implement three-phase pipeline composition (capacity → effort → integration)
- [x] 1.10 Export `truncateToTwoDecimals` helper from integration calculator for reuse

## 2. Update Domain Policies

- [x] 2.1 Remove `rnfDeveloperCount` from `DEFAULT_CALCULATION_POLICY` in `src/domain/policies/calculationPolicy.js`
- [x] 2.2 Keep `technicalRefinementHours` and `rnfPercentage` in policy

## 3. Update Application Layer

- [x] 3.1 Update `src/application/usecases/calculateSprintValue.js` to use `sprintMetricsCalculator` instead of `sprintValueCalculator`
- [x] 3.2 Pass `hasRnf` and `sprintDurationDays` inputs to new calculator
- [x] 3.3 Update `src/application/contracts/sprintCalculationContracts.js` with new output structure
- [x] 3.4 Add new output fields: `totalSprintCapacity`, `totalDailyCapacity`, `rnfTargetHours`, `rnfAllocatedDevs`, `rnfAllocatedHours`, `rnfPercentageActual`, `functionalDevs`, `functionalSprintCapacity`, `functionalDailyCapacity`, `sprintDurationDays`, `fitsInSprint`, `remainingDays`
- [x] 3.5 Rename output fields: `dailyCapacity` → `totalDailyCapacity`, `totalStoryEffort` → `baseStoryEffort`
- [x] 3.6 Remove output fields: `rawRnfHours`, `roundedRnfHours`, `rnfDailyCapacity`, `rawRnfDays`, `roundedRnfDays`
- [x] 3.7 Update output labels and formulas in contract

## 4. Update Adapter Layer

- [x] 4.1 Update `src/adapters/inbound/calculateSprintValueAdapter.js` to accept `sprintDurationDays` and `hasRnf` inputs
- [x] 4.2 Validate `sprintDurationDays` is required and positive
- [x] 4.3 Set `hasRnf` default to false if not provided
- [x] 4.4 Remove `rnfDeveloperCount` from input processing

## 5. Update UI

- [x] 5.1 Update `DEFAULT_FORM` in `app.js` to include `sprintDurationDays: 10`, `hasRnf: false`, and `pointValue: 4`
- [x] 5.2 Remove `rnfDeveloperCount` from form defaults
- [x] 5.3 Update `heroMetrics` computed property to remove RNF devs count
- [x] 5.4 Add "Sprint duration" input field to form template in Sprint Setup section
- [x] 5.5 Add "Include RNF" checkbox to form template
- [x] 5.6 Remove "RNF devs" manual input field from form
- [x] 5.7 Reorganize form template into two sections: "Sprint Setup" and "Story Sizing"
- [x] 5.8 Update `calculate` method to pass `sprintDurationDays` and `hasRnf` in payload
- [x] 5.9 Update results display template to show integrated dashboard (capacity + story views)
- [x] 5.10 Add conditional display for RNF fields in results (only show if present in output)
- [x] 5.11 Display `rnfAllocatedDevs` as readonly value with indicator (e.g., lock icon)

## 6. Create Domain Unit Tests

- [x] 6.1 Create `test/domain/sprintCapacityCalculator.test.js` with test cases for RNF allocation algorithm
- [x] 6.2 Test scenarios: normal allocation (7 devs → 2 RNF), small team (2 devs → 0 RNF), single dev (1 dev → 0 RNF)
- [x] 6.3 Test edge cases: exact 30% match, allocation at boundary, maximum constraint
- [x] 6.4 Test smart omission: RNF fields present when allocation > 0, omitted when allocation = 0
- [x] 6.5 Create `test/domain/storyEffortCalculator.test.js` with test cases for story effort calculation
- [x] 6.6 Test base story effort, technical refinement application, override behavior
- [x] 6.7 Create `test/domain/sprintIntegrationCalculator.test.js` with test cases for integration logic
- [x] 6.8 Test required days calculation using functional capacity, sprint fit determination, remaining days
- [x] 6.9 Create `test/domain/sprintMetricsCalculator.test.js` with end-to-end test cases
- [x] 6.10 Test complete pipeline with various hasRnf configurations

## 7. Update Application Tests

- [x] 7.1 Update `test/application/calculateSprintValue.acceptance.test.js` with new expected values
- [x] 7.2 Add test scenario for hasRnf=true with 7 devs (expect 2 RNF devs, 3 rounded days)
- [x] 7.3 Add test scenario for hasRnf=false with 7 devs (expect 0 RNF devs, 2 rounded days)
- [x] 7.4 Add test scenario for small team with hasRnf=true (expect 0 RNF devs, RNF fields omitted)
- [x] 7.5 Add test scenarios for sprint fit analysis (fits, does not fit, exact fit)
- [x] 7.6 Update `test/application/calculateSprintValue.validation.test.js` for new validation rules
- [x] 7.7 Add validation tests for sprintDurationDays (required, positive)
- [x] 7.8 Remove validation tests for rnfDeveloperCount (no longer applicable)
- [x] 7.9 Update all output field assertions to use new field names

## 8. Update Architecture Tests

- [x] 8.1 Update `test/architecture/layering.test.js` to include new domain service files
- [x] 8.2 Verify new calculators follow clean architecture boundaries

## 9. Update UI Tests

- [x] 9.1 Update `test/ui/page.test.js` to include new form fields (sprint duration, hasRnf checkbox)
- [x] 9.2 Remove tests for rnfDeveloperCount input field
- [x] 9.3 Add tests for separated form sections rendering
- [x] 9.4 Add tests for integrated dashboard output structure
- [x] 9.5 Add tests for conditional RNF field display
- [x] 9.6 Add tests for readonly RNF devs display in results
- [x] 9.7 Update all output field assertions to match new contract

## 10. Verification

- [x] 10.1 Run complete test suite: `npm test`
- [x] 10.2 Verify all tests pass with new implementation
- [x] 10.3 Manually test UI with various scenarios (hasRnf on/off, different team sizes)
- [x] 10.4 Verify RNF allocation displays correctly as readonly in results
- [x] 10.5 Verify separated form sections display correctly
- [x] 10.6 Verify integrated dashboard shows both capacity and story views
- [x] 10.7 Verify small team scenario (2 devs) gracefully omits RNF fields
- [x] 10.8 Verify sprint fit validation works (green for fits, red for exceeds)
