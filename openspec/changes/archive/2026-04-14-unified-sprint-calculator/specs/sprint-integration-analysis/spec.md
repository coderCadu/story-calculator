## Purpose

Define the integration between sprint capacity and story effort to determine if a story fits within sprint boundaries, calculate required days using functional capacity, and provide sprint fit analysis.

## ADDED Requirements

### Requirement: Calculate required days using functional capacity

The system SHALL calculate required story days using refined story effort divided by functional daily capacity (after RNF subtraction), with raw value truncated to 2 decimals and final value rounded up to next integer.

#### Scenario: Required days uses functional developers

- **WHEN** refinedStoryEffort is 78 hours and functionalDailyCapacity is 30 hours (5 devs × 6h)
- **THEN** rawRequiredDays equals 2.6 (78 / 30, truncated to 2 decimals)
- **THEN** roundedRequiredDays equals 3 days (ceiling)

#### Scenario: Required days increases when RNF enabled

- **WHEN** refinedStoryEffort is 78 hours and totalDailyCapacity is 42 hours (7 devs × 6h)
- **THEN** without RNF: rawRequiredDays equals 1.85 days (78 / 42)
- **WHEN** RNF allocates 2 devs leaving functionalDailyCapacity of 30 hours
- **THEN** with RNF: rawRequiredDays equals 2.6 days (78 / 30)

#### Scenario: Required days uses all devs when RNF disabled

- **WHEN** hasRnf is false and functionalDailyCapacity equals totalDailyCapacity
- **THEN** rawRequiredDays is calculated using all available developers

### Requirement: Determine sprint fit

The system SHALL determine whether a story fits within sprint duration by comparing rounded required days to sprint duration days.

#### Scenario: Story fits in sprint

- **WHEN** roundedRequiredDays is 3 and sprintDurationDays is 10
- **THEN** fitsInSprint equals true
- **THEN** remainingDays equals 7 (10 - 3)

#### Scenario: Story exactly fits sprint

- **WHEN** roundedRequiredDays is 10 and sprintDurationDays is 10
- **THEN** fitsInSprint equals true
- **THEN** remainingDays equals 0

#### Scenario: Story exceeds sprint capacity

- **WHEN** roundedRequiredDays is 12 and sprintDurationDays is 10
- **THEN** fitsInSprint equals false
- **THEN** remainingDays equals -2 (negative indicates overflow)

### Requirement: Echo sprint duration in output

The system SHALL include sprint duration days in the output for reference and validation.

#### Scenario: Sprint duration is included in output

- **WHEN** sprintDurationDays is 10
- **THEN** output includes sprintDurationDays field with value 10

### Requirement: Calculate remaining sprint days

The system SHALL calculate remaining sprint days as sprint duration minus rounded required days.

#### Scenario: Remaining days shows sprint margin

- **WHEN** sprintDurationDays is 10 and roundedRequiredDays is 3
- **THEN** remainingDays equals 7

#### Scenario: Remaining days can be zero

- **WHEN** sprintDurationDays is 5 and roundedRequiredDays is 5
- **THEN** remainingDays equals 0
- **THEN** fitsInSprint equals true

#### Scenario: Remaining days can be negative

- **WHEN** sprintDurationDays is 10 and roundedRequiredDays is 13
- **THEN** remainingDays equals -3
- **THEN** fitsInSprint equals false

### Requirement: Integration depends on functional capacity

The system SHALL use functional daily capacity (not total daily capacity) for all story day calculations, ensuring RNF allocation directly impacts story timeline.

#### Scenario: RNF allocation affects story fit

- **GIVEN** a story with 78 hours refined effort
- **WHEN** hasRnf is false with 7 devs × 6h = 42h daily capacity
- **THEN** roundedRequiredDays is 2 and fitsInSprint is true for 10-day sprint
- **WHEN** hasRnf is true allocating 2 devs (leaving 5 devs × 6h = 30h daily capacity)
- **THEN** roundedRequiredDays is 3 and fitsInSprint is still true but with less margin

#### Scenario: Small story always fits regardless of RNF

- **WHEN** refinedStoryEffort is 10 hours and sprintDurationDays is 10
- **THEN** fitsInSprint equals true regardless of hasRnf setting
