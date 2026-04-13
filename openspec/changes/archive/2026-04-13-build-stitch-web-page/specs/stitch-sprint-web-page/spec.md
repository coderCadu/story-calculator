## ADDED Requirements

### Requirement: Render a Stitch-aligned sprint calculator page

The system MUST provide a web page that visually follows the Stitch project 18046564442301055737 direction, including dark tonal layers, vibrant primary accents, and card-based sections.

#### Scenario: Page loads with expected visual structure

- **WHEN** a user opens the sprint calculator page in the browser
- **THEN** the page displays a dark layered layout with a calculator form area and a results area using Stitch-inspired visual tokens

### Requirement: Capture sprint inputs through a web form

The system MUST provide form inputs for developers, development hours per day, story points, and point value, and MUST prevent invalid submissions from reaching calculation rendering.

#### Scenario: User submits valid form values

- **WHEN** the user fills all required numeric fields with valid positive values and submits
- **THEN** the system triggers the calculation flow and renders results

#### Scenario: User submits invalid or incomplete values

- **WHEN** one or more required fields are missing or non-positive
- **THEN** the page shows validation feedback and does not render success results

### Requirement: Reuse existing sprint calculation contract

The web page MUST consume the existing calculation adapter/use-case contract and MUST NOT duplicate business formulas in the UI layer.

#### Scenario: UI invokes adapter contract

- **WHEN** the form is submitted with valid values
- **THEN** the UI calls the existing calculation adapter and renders only the returned contract values

### Requirement: Display named calculation outputs and formulas

The web page MUST render all named output metrics from the contract, including raw and rounded values where available, with clear labels and formulas.

#### Scenario: Full output is shown after successful calculation

- **WHEN** calculation succeeds
- **THEN** the UI shows named values for daily capacity, technical refinement, total effort, refined effort, required days, RNF hours, and RNF days

### Requirement: Support responsive layout

The web page MUST remain usable on desktop and mobile widths with no clipped critical controls or hidden primary results.

#### Scenario: Mobile viewport rendering

- **WHEN** the page is opened on a narrow viewport
- **THEN** form and results stack vertically and all interactive controls remain reachable without horizontal scrolling
