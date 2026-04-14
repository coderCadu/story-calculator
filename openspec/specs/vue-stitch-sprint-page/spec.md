## Purpose

Specify the Vue Stitch sprint calculator page behavior, including interactive inputs, separated form sections, integrated dashboard output, recalculation flow, and validation feedback behavior.

## ADDED Requirements

### Requirement: Organize form inputs into separated sections

The system MUST organize form inputs into two distinct sections: "Sprint Setup" for capacity configuration and "Story Sizing" for story estimation parameters.

#### Scenario: Sprint Setup section displays capacity inputs

- **WHEN** the page renders
- **THEN** a "Sprint Setup" section displays inputs for total developers, daily hours, sprint duration, and hasRnf checkbox

#### Scenario: Story Sizing section displays story inputs

- **WHEN** the page renders
- **THEN** a "Story Sizing" section displays inputs for story points, point value, and technical refinement hours

### Requirement: Display results in integrated dashboard

The system MUST display calculation results in an integrated dashboard showing both sprint capacity view and story analysis view side-by-side.

#### Scenario: Capacity and story views are shown together

- **WHEN** a calculation succeeds
- **THEN** the results display a "Sprint Capacity" section with capacity metrics
- **THEN** the results display a "Story Analysis" section with story effort and fit metrics

#### Scenario: RNF fields appear only when allocated

- **WHEN** hasRnf is true and rnfAllocatedDevs is greater than 0
- **THEN** the Sprint Capacity section includes rnfTargetHours, rnfAllocatedDevs, rnfAllocatedHours, and rnfPercentageActual
- **WHEN** hasRnf is false or rnfAllocatedDevs is 0
- **THEN** RNF fields are omitted from the output display

### Requirement: Support sprint duration input

The system MUST accept sprint duration in days as a required input field to enable sprint capacity calculations.

#### Scenario: Sprint duration is visible and required

- **WHEN** the page loads
- **THEN** a "Sprint duration" input field is displayed in the Sprint Setup section
- **THEN** the field is required for calculation
- **WHEN** the user submits without sprint duration
- **THEN** the page displays validation feedback

### Requirement: Support RNF allocation checkbox

The system MUST provide a checkbox to enable or disable automatic RNF allocation.

#### Scenario: RNF checkbox controls allocation

- **WHEN** the user checks the "Include RNF" checkbox
- **THEN** the next calculation includes RNF auto-allocation
- **WHEN** the user unchecks the checkbox
- **THEN** the next calculation omits RNF allocation and uses all developers for functional work

#### Scenario: RNF checkbox defaults to unchecked

- **WHEN** the page loads for the first time
- **THEN** the "Include RNF" checkbox is unchecked (hasRnf defaults to false)

### Requirement: Display auto-calculated RNF developer count as readonly

The system MUST display the auto-calculated RNF developer count as a readonly value in the results, not as an editable input.

#### Scenario: RNF devs shown as readonly in results

- **WHEN** calculation succeeds with hasRnf true and allocation > 0
- **THEN** the Sprint Capacity section displays rnfAllocatedDevs with a readonly indicator (e.g., lock icon, readonly badge)
- **THEN** the value is not editable by the user

### Requirement: Style checkbox inputs to match Material Design dark theme

The system MUST style checkbox inputs using Material Design dark theme with rounded borders, consistent hover states, focus indicators, and smooth transitions to maintain visual consistency with the rest of the calculator interface.

#### Scenario: Checkbox has rounded border styling

- **WHEN** the page renders with a checkbox input (e.g., "Include RNF" checkbox)
- **THEN** the checkbox displays with rounded corners matching the form's border-radius
- **THEN** the checkbox uses dark theme colors consistent with other form inputs

#### Scenario: Checkbox shows interactive states

- **WHEN** the user hovers over the checkbox
- **THEN** the checkbox displays a hover state with visual feedback (e.g., subtle border color change)
- **WHEN** the user focuses on the checkbox
- **THEN** the checkbox displays a focus indicator (e.g., outline or glow effect)

#### Scenario: Checkbox uses smooth transitions

- **WHEN** the checkbox state changes (checked/unchecked) or interactive states trigger
- **THEN** the visual changes animate smoothly using CSS transitions
- **THEN** the transition duration is consistent with other form elements

#### Scenario: Checkbox label is properly associated

- **WHEN** the page renders a checkbox with label
- **THEN** the label text is clickable and toggles the checkbox state
- **THEN** the label and checkbox are visually grouped as a single interactive element

## MODIFIED Requirements

### Requirement: Allow refinement and point value customization in the UI

The system MUST allow the user to customize technical refinement hours and point value before calculating, while RNF developer allocation is automatically calculated based on sprint capacity.

#### Scenario: User changes refinement hours and point value

- **WHEN** the user edits the refinement hours field and the point value field
- **THEN** the next calculation uses those current values instead of only the defaults

#### Scenario: Default values are visible on first load

- **WHEN** the page loads for the first time
- **THEN** the total developers field shows 7
- **THEN** the daily hours field shows 6
- **THEN** the sprint duration field shows 10
- **THEN** the hasRnf checkbox is unchecked
- **THEN** the story points field shows 13
- **THEN** the point value field shows 4
- **THEN** the refinement hours field shows 26

### Requirement: Display the full set of named sprint outputs

The system MUST display the named calculation outputs returned by the calculation contract, organized into Sprint Capacity and Story Analysis sections.

#### Scenario: Sprint Capacity section shows capacity metrics

- **WHEN** a calculation succeeds
- **THEN** the Sprint Capacity section displays totalSprintCapacity, totalDailyCapacity, functionalDevs, functionalSprintCapacity, and functionalDailyCapacity
- **THEN** if RNF allocated, also displays rnfTargetHours, rnfAllocatedDevs, rnfAllocatedHours, and rnfPercentageActual

#### Scenario: Story Analysis section shows effort and fit metrics

- **WHEN** a calculation succeeds
- **THEN** the Story Analysis section displays baseStoryEffort, technicalRefinementHours, refinedStoryEffort, rawRequiredDays, roundedRequiredDays
- **THEN** also displays sprintDurationDays, fitsInSprint, and remainingDays

## REMOVED Requirements

### Requirement: Allow RNF developer count customization in UI

**Reason**: RNF developers are now auto-calculated based on sprint capacity (30% optimal allocation). Manual input removed.

**Migration**: Use the "Include RNF" checkbox to enable/disable RNF allocation. The system automatically determines optimal developer count. View the auto-calculated value in results as readonly.
