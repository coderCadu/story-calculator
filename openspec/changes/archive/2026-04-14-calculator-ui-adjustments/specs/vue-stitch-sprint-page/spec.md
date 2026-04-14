## Purpose

Specify the Vue Stitch sprint calculator page behavior, including interactive inputs, separated form sections, integrated dashboard output, recalculation flow, and validation feedback behavior.

## ADDED Requirements

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
