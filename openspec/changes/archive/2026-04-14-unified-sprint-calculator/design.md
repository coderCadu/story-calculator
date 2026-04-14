## Context

The current sprint calculator (`sprintValueCalculator.js`) implements a story-centric model: given story points and developer capacity, it calculates how many days are needed. RNF (Requisitos Não Funcionais) allocation is manual via `rnfDeveloperCount` input, and RNF hours are calculated as 30% of refined story effort.

Teams need dual perspectives:
1. **Top-down**: Given a sprint duration, what's our total capacity? How should we allocate RNF?
2. **Bottom-up**: Given a story size, will it fit in the sprint?

The system operates within clean architecture boundaries: domain (pure calculation), application (use cases), adapters (UI integration).

## Goals / Non-Goals

**Goals:**

- Implement mathematical RNF allocation (O(1) algorithm) that auto-calculates optimal developer count ≤30% of sprint capacity
- Create composed pipeline architecture with separate calculators for capacity, effort, and integration
- Enable both top-down (sprint capacity) and bottom-up (story estimation) views in a single unified model
- Calculate sprint fit analysis (whether story fits, remaining days available)
- Maintain clean architecture separation and testability
- Accept breaking changes to achieve cleaner API and more accurate calculations

**Non-Goals:**

- Maintain backward compatibility with old output structure
- Support manual RNF developer allocation (fully automated)
- Add sprint planning features beyond capacity and fit validation
- Change existing rounding policies or truncation strategies
- Modify technical refinement or point value calculation formulas

## Decisions

### Decision 1: Mathematical RNF Allocation Algorithm

**Choice**: Use direct calculation `floor(rnfTarget / devCapacity)` instead of iterative linear search.

**Rationale**:
- **Performance**: O(1) vs O(n) - instant for any team size
- **Clarity**: "How many devs fit in 30%?" is more explicit than looping
- **Maintainability**: Easier to test, modify, and extend
- **Correctness**: Mathematically equivalent to linear search when using floor()

**Algorithm**:
```javascript
const rnfTarget = totalCapacity * 0.30;
const devCapacity = hoursPerDay * sprintDays;
const idealDevs = rnfTarget / devCapacity;
const allocatedDevs = Math.floor(idealDevs); // Never exceed 30%
const finalDevs = Math.max(0, Math.min(allocatedDevs, totalDevs - 1));
```

**Alternatives considered**:
- Linear search: Works but slower and less clear
- Math.round(): Could exceed 30% target, violates requirement
- Math.ceil(): Always exceeds target unless exact match

### Decision 2: Composed Pipeline Architecture (Path B)

**Choice**: Separate calculators for capacity, effort, and integration orchestrated by main calculator.

**Structure**:
```
sprintCapacityCalculator.js     → Phase 1: Top-down
storyEffortCalculator.js         → Phase 2: Bottom-up
sprintIntegrationCalculator.js   → Phase 3: Integration
sprintMetricsCalculator.js       → Orchestrator
```

**Rationale**:
- **Testability**: Each phase can be unit tested independently
- **Clarity**: Single Responsibility Principle - each calculator has one job
- **Reusability**: Can use capacity calculator without story context, or vice versa
- **Maintainability**: Changes to one phase don't ripple through entire calculation

**Alternatives considered**:
- Single unified function: Simpler call site but ~200 lines, harder to test
- Extend existing calculator: Would create messy conditional logic and backward compatibility burden

### Decision 3: Smart Output Omission

**Choice**: When `hasRnf=true` but allocation fails (returns 0 devs), omit all RNF fields from output.

**Rationale**:
- **User experience**: Clean output without confusing "0 devs allocated" messages
- **Consistency**: Output with `hasRnf=true` but 0 allocation looks identical to `hasRnf=false`
- **Clarity**: Functional capacity naturally uses all devs when RNF not feasible

**Behavior**:
```javascript
// Small team: 2 devs, allocation = 0
if (hasRnf && allocatedDevs > 0) {
  return { ...base, rnfTargetHours, rnfAllocatedDevs, ... };
} else {
  return { ...base, functionalDevs: totalDevs, ... };
}
// Output omits RNF fields
```

**Alternatives considered**:
- Show 0 values explicitly: Clutters output, confusing UX
- Show warning message: Adds UI complexity, user already sees checkbox state
- Disable checkbox when infeasible: Requires recalculation on every input change

### Decision 4: Breaking Changes to Output Contract

**Choice**: Accept breaking changes to rename/remove/add fields for cleaner API.

**Changes**:
- **Renamed**: `dailyCapacity` → `totalDailyCapacity`, `totalStoryEffort` → `baseStoryEffort`
- **Removed**: `rawRnfHours`, `roundedRnfHours`, `rnfDailyCapacity`, `rawRnfDays`, `roundedRnfDays`
- **Added**: `totalSprintCapacity`, `rnfTargetHours`, `rnfAllocatedDevs`, `rnfAllocatedHours`, `rnfPercentageActual`, `functionalDevs`, `functionalSprintCapacity`, `functionalDailyCapacity`, `sprintDurationDays`, `fitsInSprint`, `remainingDays`

**Rationale**:
- Old RNF fields were story-centric (30% of effort) - no longer relevant in capacity model
- New naming is explicit: `totalDailyCapacity` vs `functionalDailyCapacity` eliminates ambiguity
- Fit analysis fields enable sprint validation, a key user need
- Clean break now prevents accumulating technical debt

**Alternatives considered**:
- Maintain backward compatibility with feature flags: Doubles test surface, creates confusion
- Gradual migration: Prolongs migration pain, increases complexity

### Decision 5: Separated UI Sections

**Choice**: Use Approach 2 from exploration - separated "Sprint Setup" and "Story Sizing" sections.

**Rationale**:
- **Mental model clarity**: Top-down vs bottom-up are conceptually distinct
- **Visual hierarchy**: Easier to scan and understand input groupings
- **Future extensibility**: Easy to add fields to relevant section
- **Consistent with dashboard output**: Results also show capacity vs story views

**Alternatives considered**:
- Unified form: Everything mixed together, harder to parse
- Tabbed view: Over-separates related inputs, requires tab switching

### Decision 6: Input Defaults

**Choice**: Set `hasRnf=false`, `pointValue=4`, `technicalRefinementHours=26`.

**Rationale**:
- `hasRnf=false`: Conservative default - user must opt into RNF allocation
- `pointValue=4`: Observed common value, reduces input friction
- `technicalRefinementHours=26`: Preserves existing policy default

### Decision 7: Integration Model - Option A

**Choice**: Story calculation uses **functional developers** (after RNF subtraction).

**Model**:
```
hasRnf=true:  functionalDevs = totalDevs - rnfDevs
              dailyCapacity = functionalDevs × hours
              
hasRnf=false: functionalDevs = totalDevs
              dailyCapacity = totalDevs × hours
```

**Rationale**:
- RNF devs are dedicated to non-functional work, removed from story capacity
- More realistic: reflects actual team allocation
- Story duration increases when RNF enabled (accurate reflection of reduced capacity)

**Alternatives considered**:
- RNF work in parallel: Oversimplifies team dynamics, assumes perfect separation
- Manual allocation: Returns to old problem, removes automation benefit

## Risks / Trade-offs

**Risk: Breaking changes impact all tests**
- Mitigation: Update all test expectations in single atomic change. Use comprehensive acceptance tests to validate new behavior.

**Risk: Small teams may see 0 RNF allocation**
- Mitigation: Smart omission handles gracefully. Document that RNF requires sufficient team size (typically ≥3 devs for 30% with standard hours).

**Risk: Mathematical allocation may not match team preferences in edge cases**
- Mitigation: Algorithm is deterministic and documented. Future enhancement could add manual override if needed, but start with pure automation.

**Trade-off: Breaking changes require all consumers to update**
- Benefit: Cleaner API, accurate calculations, better user experience. Single codebase with one consumer (Vue UI) minimizes migration pain.

**Trade-off: More domain files increase navigation complexity**
- Benefit: Testability and maintainability outweigh. Clear naming (`sprintCapacityCalculator`) makes purpose obvious.

**Trade-off: Some RNF context from old model is lost (days, intermediate hours)**
- Benefit: New model is capacity-based, aligns with actual RNF planning needs. Old metrics were story-dependent, less useful for sprint planning.
