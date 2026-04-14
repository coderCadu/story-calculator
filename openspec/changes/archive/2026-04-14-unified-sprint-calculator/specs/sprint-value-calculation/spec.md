## Purpose

Define the canonical sprint value calculation contract, including validation rules, intermediate outputs, and final metrics consumed by UIs and adapters.

## MODIFIED Requirements

### Requirement: Calculate daily capacity

The system MUST calculate total daily capacity using the formula: totalDailyCapacity = developers × developmentHoursPerDay.

#### Scenario: Total daily capacity is computed from inputs

- **WHEN** developers is 7 and developmentHoursPerDay is 6
- **THEN** totalDailyCapacity equals 42

### Requirement: Calculate total story effort and technical refinement effort

The system MUST calculate base story effort and effort with technical refinement using canonical formulas and MUST allow an optional technical refinement override when provided by a calling UI or adapter.

#### Scenario: Base story effort and refined effort are computed

- **WHEN** storyPoints is 55 and pointValue is 4
- **THEN** baseStoryEffort equals 220

#### Scenario: Technical refinement default is applied

- **WHEN** baseStoryEffort is available and no override policy is provided
- **THEN** technicalRefinementHours equals 26
- **THEN** refinedStoryEffort equals baseStoryEffort + technicalRefinementHours

#### Scenario: Technical refinement override is used

- **WHEN** the caller provides technicalRefinementHours equal to 32
- **THEN** the system uses 32 instead of the default 26 while keeping the same calculation contract

### Requirement: Calculate required story days using functional capacity

The system MUST calculate required story days using refined story effort divided by functional daily capacity (after RNF subtraction) and MUST round up to the next integer day.

#### Scenario: Story days use functional capacity and ceiling rounding

- **WHEN** refinedStoryEffort is 78 and functionalDailyCapacity is 30 (5 functional devs × 6h)
- **THEN** rawRequiredDays equals 2.6 (truncated to 2 decimals)
- **THEN** roundedRequiredDays equals 3

#### Scenario: Story days use total capacity when RNF disabled

- **WHEN** refinedStoryEffort is 78 and functionalDailyCapacity equals totalDailyCapacity of 42 (all 7 devs)
- **THEN** rawRequiredDays equals 1.85 (truncated to 2 decimals)
- **THEN** roundedRequiredDays equals 2

### Requirement: Return all named calculation outputs

The system MUST return every intermediate and final value with its respective business label.

#### Scenario: Output includes complete named values

- **WHEN** the calculation succeeds
- **THEN** output includes named fields: totalDailyCapacity, baseStoryEffort, technicalRefinementHours, refinedStoryEffort, rawRequiredDays, roundedRequiredDays
- **THEN** output includes capacity fields when hasRnf is true: totalSprintCapacity, rnfTargetHours, rnfAllocatedDevs, rnfAllocatedHours, rnfPercentageActual, functionalDevs, functionalSprintCapacity, functionalDailyCapacity
- **THEN** output includes integration fields: sprintDurationDays, fitsInSprint, remainingDays

## REMOVED Requirements

### Requirement: Calculate RNF reserve and RNF days

**Reason**: RNF calculation moved to sprint capacity model (30% of sprint capacity instead of 30% of story effort). RNF is now auto-allocated as developers, not calculated as hours from story effort.

**Migration**: Use `sprint-capacity-calculation` capability which auto-allocates RNF developers based on sprint capacity. The new model provides `rnfAllocatedDevs`, `rnfAllocatedHours`, and `rnfPercentageActual` instead of `rawRnfHours`, `roundedRnfHours`, `rnfDailyCapacity`, `rawRnfDays`, and `roundedRnfDays`.

### Requirement: Validate RNF developer count input

**Reason**: RNF developers are now auto-calculated, not provided as input. The `rnfDeveloperCount` parameter is removed.

**Migration**: Enable RNF allocation using `hasRnf` input field (boolean, default false). The system will automatically calculate optimal developer allocation.

## RENAMED Requirements

FROM: "Calculate daily capacity"
TO: "Calculate total daily capacity"

FROM: "Calculate total story effort and technical refinement effort"  
TO: "Calculate base story effort and technical refinement effort"

FROM: "Calculate required story days with ceiling rounding"
TO: "Calculate required story days using functional capacity"
