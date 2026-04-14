## Context

The sprint calculator currently uses a basic checkbox input for the "Include RNF" toggle that doesn't match the polished Material Design dark theme aesthetic used throughout the rest of the interface (rounded borders, consistent hover states, smooth transitions).

Additionally, the `baseStoryEffort` metric (story points × point value) is calculated internally in `storyEffortCalculator` but not exposed in the output contract, limiting users' visibility into the calculation breakdown. Users can't see the effort calculation before technical refinement is applied.

## Goals / Non-Goals

**Goals:**
- Style checkbox to match Material Design dark theme with rounded corners, smooth hover/focus transitions
- Expose `baseStoryEffort` in the output contract as a visible metric in the dashboard
- Maintain backward compatibility (additive change only)
- Keep implementation simple and focused on these two specific improvements

**Non-Goals:**
- Redesigning the entire UI theme (only checkbox styling)
- Changing calculation logic (only exposing existing internal metric)
- Adding new calculation capabilities

## Decisions

### Decision 1: Use CSS-only checkbox styling (no JavaScript component library)

**Rationale:** The checkbox functionality already works correctly using native HTML + Vue. Adding a component library dependency for a single checkbox would be heavy-handed. CSS custom styling is sufficient for visual consistency.

**Alternatives considered:**
- Option A (chosen): Pure CSS styling with `:checked`, `:hover`, `:focus` pseudo-classes
- Option B: Import Material UI component library → Rejected: too heavy for one component
- Option C: Create custom Vue checkbox component → Rejected: over-engineering for simple styling

**Implementation:** Add `.checkbox-label` styles to `styles.css` targeting `input[type="checkbox"]` with custom appearance, rounded borders, dark background, and smooth transitions.

### Decision 2: Expose baseStoryEffort in output contract

**Rationale:** The metric already exists internally in the domain calculator (`baseStoryEffort = storyPoints × pointValue`). The contract already exposes refined effort, so exposing base effort is consistent and provides transparency.

**Alternatives considered:**
- Option A (chosen): Add `baseStoryEffort` to output contract with label and formula
- Option B: Calculate derived value in UI layer → Rejected: domain logic should stay in domain layer
- Option C: Don't expose it → Rejected: users benefit from seeing effort before refinement

**Implementation:** Modify `createSprintCalculationOutputContract` in `sprintCalculationContracts.js` to include `baseStoryEffort` field from the calculator result.

### Decision 3: Display baseStoryEffort in Story Analysis section

**Rationale:** `baseStoryEffort` is a story-related metric (before refinement), so it belongs in the Story Analysis dashboard section alongside other story metrics. This groups related metrics logically.

**Implementation:** Add `baseStoryEffort` to `storyMetrics` computed property categorization in `app.js`. The metric will automatically appear in the Story Analysis section grid.

## Risks / Trade-offs

**[Risk: Custom checkbox styling may not work consistently across browsers]**  
→ Mitigation: Use standard CSS properties supported in modern evergreen browsers. Test in Chrome, Safari, Firefox. Material Design patterns are well-documented and widely supported.

**[Risk: Adding baseStoryEffort to output contract might confuse users who expect only final metrics]**  
→ Mitigation: The metric includes clear label ("Esforço base da história") and formula showing the calculation. Dashboard design already shows intermediate values (like technical refinement hours), so this is consistent with existing UX.

**[Trade-off: More metrics in dashboard = more visual density]**  
→ Acceptable: The Story Analysis section already shows multiple metrics. One additional metric provides valuable transparency without overwhelming the interface.

**[Risk: Tests may need updates]**  
→ Expected: Acceptance tests should verify `baseStoryEffort` appears in output. UI tests should verify checkbox styling exists in markup. Both are straightforward test updates.
