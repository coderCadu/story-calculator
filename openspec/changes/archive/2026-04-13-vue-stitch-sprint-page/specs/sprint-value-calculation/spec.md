## MODIFIED Requirements

### Requirement: Calculate total story effort and technical refinement effort

The system MUST calculate total story effort and effort with technical refinement using canonical formulas and MUST allow an optional technical refinement override when provided by a calling UI or adapter.

#### Scenario: Story effort and refined effort are computed

- **WHEN** storyPoints is 55 and pointValue is 4
- **THEN** totalStoryEffort equals 220 and is returned with the name "Esforço total da história"

#### Scenario: Technical refinement default is applied

- **WHEN** totalStoryEffort is available and no override policy is provided
- **THEN** technicalRefinementHours equals 26 with name "Refinamento técnico"
- **THEN** refinedStoryEffort equals totalStoryEffort + technicalRefinementHours with name "Com refinamento técnico"

#### Scenario: Technical refinement override is used

- **WHEN** the caller provides technicalRefinementHours equal to 32
- **THEN** the system uses 32 instead of the default 26 while keeping the same calculation contract

### Requirement: Calculate RNF reserve and RNF days

The system MUST calculate RNF reserve as 30% of refined story effort, round RNF hours to the nearest integer, and calculate RNF days using 2 developers as the default RNF staffing rule while allowing the caller to override the RNF developer count.

#### Scenario: RNF hours are calculated and rounded

- **WHEN** refinedStoryEffort is 246
- **THEN** rawRnfHours equals 73.8 and roundedRnfHours equals 74 with the name "RNF 30%"

#### Scenario: RNF days are calculated with 2 developers

- **WHEN** roundedRnfHours is 74, developmentHoursPerDay is 6, and RNF developer count default is 2
- **THEN** rnfDailyCapacity equals 12
- **THEN** rawRnfDays equals 6.16 and roundedRnfDays equals 6 with the name "Dias de RNF"

#### Scenario: RNF developer count override is used

- **WHEN** the caller provides rnfDeveloperCount equal to 3 and developmentHoursPerDay equal to 6
- **THEN** the system uses 18 as rnfDailyCapacity for the RNF day calculation while preserving the rest of the contract

### Requirement: Return all named calculation outputs

The system MUST return every intermediate and final value with its respective business label.

#### Scenario: Output includes complete named values

- **WHEN** the calculation succeeds
- **THEN** output includes all named fields: "Capacidade diária", "Refinamento técnico", "Esforço total da história", "Com refinamento técnico", "Número de dias necessários", "RNF 30%", and "Dias de RNF"
