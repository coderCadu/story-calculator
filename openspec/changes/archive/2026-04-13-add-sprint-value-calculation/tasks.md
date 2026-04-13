## 1. Setup and Contracts

- [x] 1.1 Create input contract with required fields: developers, developmentHoursPerDay, storyPoints, pointValue
- [x] 1.2 Create output contract with all named intermediate and final values
- [x] 1.3 Define calculation policy constants for technicalRefinementHours=26, rnfPercentage=0.30, and rnfDeveloperCount=2

## 2. Domain Calculation Pipeline

- [x] 2.1 Implement daily capacity formula: developers * developmentHoursPerDay
- [x] 2.2 Implement total story effort formula: storyPoints * pointValue
- [x] 2.3 Implement refined effort formula: totalStoryEffort + technicalRefinementHours
- [x] 2.4 Implement required story days formula: refinedStoryEffort / dailyCapacity with ceiling rounding

## 3. RNF Calculation Rules

- [x] 3.1 Implement RNF hours formula: refinedStoryEffort * 0.30
- [x] 3.2 Implement RNF hours rounding to nearest integer
- [x] 3.3 Implement RNF daily capacity formula using 2 developers: 2 * developmentHoursPerDay
- [x] 3.4 Implement RNF days formula: roundedRnfHours / rnfDailyCapacity with nearest-integer rounding

## 4. Validation and Error Handling

- [x] 4.1 Validate required fields and return structured errors for missing inputs
- [x] 4.2 Validate non-positive values and block invalid divisions
- [x] 4.3 Add deterministic error mapping for adapters without leaking domain internals

## 5. Testing and Acceptance Examples

- [x] 5.1 Add unit tests for each formula and rounding policy
- [x] 5.2 Add acceptance test for example: 7 devs, 6h/day, 55 points, 4 value/point resulting in 6 story days and 74 RNF hours
- [x] 5.3 Add acceptance test for RNF days example using 2 devs and 6h/day resulting in 6 RNF days
- [x] 5.4 Add negative tests for missing inputs and invalid numeric values

## 6. Architecture and Maintainability

- [x] 6.1 Ensure business rules remain in domain/application layers only
- [x] 6.2 Ensure adapters only orchestrate I/O and consume stable contracts
- [x] 6.3 Refactor duplicate formula logic into shared domain services to preserve DRY
