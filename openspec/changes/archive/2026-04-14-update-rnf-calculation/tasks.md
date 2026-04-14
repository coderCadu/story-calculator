## 1. Update Domain Calculation

- [x] 1.1 Change RNF hours formula in `sprintValueCalculator.js` from `refinedStoryEffort * policy.rnfPercentage` to `dailyCapacity * policy.rnfPercentage`
- [x] 1.2 Verify that `rawRnfHours` calculation uses truncation to two decimals
- [x] 1.3 Verify that `roundedRnfHours` uses Math.round for nearest integer

## 2. Update Output Contract Labels

- [x] 2.1 Update `rnfHours` formula label in `sprintCalculationContracts.js` from "refinedStoryEffort * rnfPercentage (nearest integer)" to "dailyCapacity * rnfPercentage (nearest integer)"
- [x] 2.2 Verify all other labels remain unchanged

## 3. Update Domain Unit Tests

- [x] 3.1 Calculate new expected values for `rawRnfHours` in domain tests using formula: `dailyCapacity * 0.30`
- [x] 3.2 Update all assertions in `test/domain/sprintValueCalculator.test.js` with new expected values
- [x] 3.3 Update assertions for `roundedRnfHours` using Math.round of new raw values
- [x] 3.4 Update assertions for `rawRnfDays` and `roundedRnfDays` based on new RNF hours
- [x] 3.5 Run domain tests and verify all pass

## 4. Update Acceptance Tests

- [x] 4.1 Calculate new expected RNF values for acceptance test example (7 devs, 6h/day): dailyCapacity=42, rawRnfHours=12.60, roundedRnfHours=13
- [x] 4.2 Calculate new expected RNF days for acceptance test: rawRnfDays=1.08, roundedRnfDays=1
- [x] 4.3 Update assertions in `test/application/calculateSprintValue.acceptance.test.js` with new values
- [x] 4.4 Run acceptance tests and verify all pass

## 5. Update Validation Tests

- [x] 5.1 Review validation tests in `test/application/calculateSprintValue.validation.test.js` to ensure they don't hardcode RNF values
- [x] 5.2 Update any validation test assertions that check specific RNF output values
- [x] 5.3 Run validation tests and verify all pass

## 6. Final Verification

- [x] 6.1 Run complete test suite: `npm test`
- [x] 6.2 Verify no test failures
- [x] 6.3 Verify no breaking changes in architecture tests
- [x] 6.4 Manually verify calculation with example inputs in UI/adapter if available
