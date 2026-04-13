## ADDED Requirements

### Requirement: Validate required sprint value inputs

The system MUST validate quantity of developers, development hours per day, total story points, and point value before executing any calculation.

#### Scenario: Missing required input

- **WHEN** at least one required field is omitted in the request
- **THEN** the system returns a structured validation error and no calculation result

#### Scenario: Non-positive divisor input

- **WHEN** quantity of developers or development hours per day is less than or equal to zero
- **THEN** the system returns a structured validation error and MUST NOT perform division

### Requirement: Calculate daily capacity

The system MUST calculate daily capacity using the formula: dailyCapacity = developers \* developmentHoursPerDay.

#### Scenario: Daily capacity is computed from inputs

- **WHEN** developers is 7 and developmentHoursPerDay is 6
- **THEN** dailyCapacity equals 42 and is returned with the name "Capacidade diária"

### Requirement: Calculate total story effort and technical refinement effort

The system MUST calculate total story effort and effort with technical refinement using canonical formulas.

#### Scenario: Story effort and refined effort are computed

- **WHEN** storyPoints is 55 and pointValue is 4
- **THEN** totalStoryEffort equals 220 and is returned with the name "Esforço total da história"

#### Scenario: Technical refinement default is applied

- **WHEN** totalStoryEffort is available and no override policy is provided
- **THEN** technicalRefinementHours equals 26 with name "Refinamento técnico"
- **THEN** refinedStoryEffort equals totalStoryEffort + technicalRefinementHours with name "Com refinamento técnico"

### Requirement: Calculate required story days with ceiling rounding

The system MUST calculate required story days using refined story effort divided by daily capacity and MUST round up to the next integer day.

#### Scenario: Story days use ceiling rounding

- **WHEN** refinedStoryEffort is 246 and dailyCapacity is 42
- **THEN** rawRequiredDays equals 5.85 and roundedRequiredDays equals 6 with the name "Número de dias necessários"

### Requirement: Calculate RNF reserve and RNF days

The system MUST calculate RNF reserve as 30% of refined story effort, round RNF hours to the nearest integer, and calculate RNF days using 2 developers as the default RNF staffing rule.

#### Scenario: RNF hours are calculated and rounded

- **WHEN** refinedStoryEffort is 246
- **THEN** rawRnfHours equals 73.8 and roundedRnfHours equals 74 with the name "RNF 30%"

#### Scenario: RNF days are calculated with 2 developers

- **WHEN** roundedRnfHours is 74, developmentHoursPerDay is 6, and RNF developer count default is 2
- **THEN** rnfDailyCapacity equals 12
- **THEN** rawRnfDays equals 6.16 and roundedRnfDays equals 6 with the name "Dias de RNF"

### Requirement: Return all named calculation outputs

The system MUST return every intermediate and final value with its respective business label.

#### Scenario: Output includes complete named values

- **WHEN** the calculation succeeds
- **THEN** output includes all named fields: "Capacidade diária", "Refinamento técnico", "Esforço total da história", "Com refinamento técnico", "Número de dias necessários", "RNF 30%", and "Dias de RNF"
