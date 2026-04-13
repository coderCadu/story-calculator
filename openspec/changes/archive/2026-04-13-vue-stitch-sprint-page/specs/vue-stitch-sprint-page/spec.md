## ADDED Requirements

### Requirement: Render a Vue-based sprint calculator page

The system MUST provide the sprint calculator interface as a Vue page that follows the Stitch dark visual direction from the latest referenced screen.

#### Scenario: Page renders with Vue structure

- **WHEN** the user opens the application in a browser
- **THEN** the interface is rendered by Vue and presents a Stitch-aligned dark calculator layout

### Requirement: Allow refinement and RNF policy customization in the UI

The system MUST allow the user to customize technical refinement hours and the number of developers used for RNF before calculating.

#### Scenario: User changes refinement and RNF dev count

- **WHEN** the user edits the refinement hours field and the RNF developer count field
- **THEN** the next calculation uses those current values instead of only the defaults

#### Scenario: Default values are visible on first load

- **WHEN** the page loads for the first time
- **THEN** the refinement hours field shows 26 and the RNF developer count field shows 2

### Requirement: Recalculate using the latest field values on each submit

The system MUST recalculate the sprint outputs from the latest field values every time the user clicks Calcular sprint.

#### Scenario: User recalculates after editing inputs

- **WHEN** the user updates any numeric field and clicks Calcular sprint
- **THEN** the page renders a fresh set of outputs based on the current values at submission time

### Requirement: Display the full set of named sprint outputs

The system MUST display the named calculation outputs returned by the calculation contract, including intermediate values and final metrics.

#### Scenario: Calculation results are rendered

- **WHEN** a calculation succeeds
- **THEN** the page displays daily capacity, technical refinement, total story effort, refined effort, required story days, RNF hours, and RNF days with their labels

### Requirement: Preserve validation feedback in the page

The system MUST show validation feedback in the UI when the calculation contract returns structured errors.

#### Scenario: Invalid input is submitted

- **WHEN** the user submits an invalid combination of values
- **THEN** the page displays structured validation feedback and does not overwrite the last valid result with invalid data
