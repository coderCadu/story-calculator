## Purpose

Define the canonical sprint capacity calculation including total capacity, automatic RNF developer allocation, and functional capacity after RNF subtraction.

## ADDED Requirements

### Requirement: Calculate total sprint capacity

The system SHALL calculate total sprint capacity using the formula: totalSprintCapacity = developers × developmentHoursPerDay × sprintDurationDays.

#### Scenario: Total sprint capacity is computed from inputs

- **WHEN** developers is 7, developmentHoursPerDay is 6, and sprintDurationDays is 10
- **THEN** totalSprintCapacity equals 420 hours

#### Scenario: Total daily capacity is computed

- **WHEN** developers is 7 and developmentHoursPerDay is 6
- **THEN** totalDailyCapacity equals 42 hours

### Requirement: Auto-allocate RNF developers using mathematical optimization

The system SHALL automatically calculate optimal RNF developer allocation using direct mathematical calculation where allocatedDevs = floor(rnfTarget / devCapacity), ensuring allocation never exceeds 30% of total capacity and leaves at least one developer for functional work.

#### Scenario: RNF developers are auto-allocated to closest value under 30%

- **WHEN** totalSprintCapacity is 420 hours (7 devs, 6h/day, 10 days)
- **THEN** rnfTargetHours equals 126 hours (30% of 420)
- **THEN** devCapacity equals 60 hours (6 × 10)
- **THEN** idealDevs equals 2.1 (126 / 60)
- **THEN** rnfAllocatedDevs equals 2 (floor of 2.1)
- **THEN** rnfAllocatedHours equals 120 hours (2 × 6 × 10)
- **THEN** rnfPercentageActual equals 28.57% (120 / 420 × 100, truncated to 2 decimals)

#### Scenario: RNF allocation respects maximum constraint

- **WHEN** calculated allocation would use all developers
- **THEN** finalDevs is limited to (totalDevs - 1) to ensure at least 1 developer remains for functional work

#### Scenario: Small team results in zero RNF allocation

- **WHEN** developers is 2, developmentHoursPerDay is 6, and sprintDurationDays is 10
- **THEN** totalSprintCapacity equals 120 hours
- **THEN** rnfTargetHours would be 36 hours (30%)
- **THEN** single dev capacity is 60 hours (exceeds 36)
- **THEN** rnfAllocatedDevs equals 0 (floor of 0.6)
- **THEN** no RNF fields appear in output (smart omission)

#### Scenario: Single developer team cannot allocate RNF

- **WHEN** developers is 1
- **THEN** rnfAllocatedDevs equals 0
- **THEN** functionalDevs equals 1
- **THEN** no RNF fields appear in output

### Requirement: Calculate functional capacity after RNF subtraction

The system SHALL calculate functional developer count and capacity by subtracting RNF allocation from total capacity.

#### Scenario: Functional capacity with RNF enabled

- **WHEN** totalDevs is 7 and rnfAllocatedDevs is 2
- **THEN** functionalDevs equals 5
- **THEN** functionalDailyCapacity equals 30 hours (5 × 6)
- **THEN** functionalSprintCapacity equals 300 hours (5 × 6 × 10)

#### Scenario: Functional capacity equals total when RNF disabled

- **WHEN** hasRnf is false
- **THEN** functionalDevs equals totalDevs
- **THEN** functionalDailyCapacity equals totalDailyCapacity
- **THEN** functionalSprintCapacity equals totalSprintCapacity

#### Scenario: Functional capacity equals total when allocation fails

- **WHEN** hasRnf is true but rnfAllocatedDevs is 0 (team too small)
- **THEN** functionalDevs equals totalDevs
- **THEN** functionalDailyCapacity equals totalDailyCapacity
- **THEN** functionalSprintCapacity equals totalSprintCapacity
- **THEN** no RNF fields appear in output

### Requirement: Smart output omission for failed RNF allocation

The system SHALL omit RNF fields from output when hasRnf is true but allocation results in zero developers.

#### Scenario: RNF fields omitted when allocation is zero

- **WHEN** hasRnf is true and rnfAllocatedDevs equals 0
- **THEN** rnfTargetHours is not included in output
- **THEN** rnfAllocatedDevs is not included in output
- **THEN** rnfAllocatedHours is not included in output
- **THEN** rnfPercentageActual is not included in output
- **THEN** functionalDevs equals totalDevs

#### Scenario: RNF fields present when allocation succeeds

- **WHEN** hasRnf is true and rnfAllocatedDevs is greater than 0
- **THEN** output includes rnfTargetHours, rnfAllocatedDevs, rnfAllocatedHours, and rnfPercentageActual
- **THEN** functionalDevs equals (totalDevs - rnfAllocatedDevs)

### Requirement: Validate sprint capacity inputs

The system SHALL validate sprint duration, developers, and development hours before calculating capacity.

#### Scenario: Sprint duration is required

- **WHEN** sprintDurationDays is missing or null
- **THEN** the system returns a structured validation error

#### Scenario: Sprint duration must be positive

- **WHEN** sprintDurationDays is less than or equal to zero
- **THEN** the system returns a structured validation error

#### Scenario: Developers must be positive for capacity calculation

- **WHEN** developers is less than or equal to zero
- **THEN** the system returns a structured validation error for capacity calculation
