## MODIFIED Requirements

### Requirement: Return all named calculation outputs

The system MUST return every intermediate and final value with its respective business label and formula metadata so external clients, including the web UI, can render deterministic result cards.

#### Scenario: Output includes complete named values

- **WHEN** the calculation succeeds
- **THEN** output includes all named fields: "Capacidade diária", "Refinamento técnico", "Esforço total da história", "Com refinamento técnico", "Número de dias necessários", "RNF 30%", and "Dias de RNF"

#### Scenario: Output includes formula-friendly metadata

- **WHEN** the calculation succeeds
- **THEN** each metric includes enough metadata for UI display (at least label and final value, and raw/formula when applicable)
