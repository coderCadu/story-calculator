## 1. Foundation and Project Structure

- [ ] 1.1 Create clean architecture module boundaries for domain, application, and adapters
- [ ] 1.2 Define shared types and error model contracts for deterministic validation and domain failures
- [ ] 1.3 Add project lint/test conventions that enforce DRY, SOLID, and dependency direction rules

## 2. Domain Modeling

- [ ] 2.1 Implement value objects for core sprint calculation inputs with invariant checks
- [ ] 2.2 Implement domain entities/services for canonical sprint time formula execution
- [ ] 2.3 Implement normalization rules so representationally equivalent inputs become equivalent domain values
- [ ] 2.4 Add unit tests for domain invariants, normalization behavior, and deterministic formula results

## 3. Application Use Case and Contracts

- [ ] 3.1 Define CalculateSprintTime request/response contracts for adapter-safe consumption
- [ ] 3.2 Implement CalculateSprintTime use case orchestrating validation, normalization, and domain calculation
- [ ] 3.3 Implement structured error mapping from domain/application to machine-readable output payloads
- [ ] 3.4 Add unit tests for successful calculation flow and validation/error scenarios

## 4. Adapter Integration

- [ ] 4.1 Implement initial inbound adapter interface (service boundary) that calls application contracts only
- [ ] 4.2 Ensure adapter output mapping preserves stable response schema for success and failure
- [ ] 4.3 Add integration tests verifying adapter-to-use-case flow without domain internals leakage

## 5. Stitch Prototype Alignment

- [ ] 5.1 Extract and document required sprint calculation parameters from the Stitch MCP prototype
- [ ] 5.2 Create executable acceptance test fixtures mirroring Stitch prototype examples
- [ ] 5.3 Verify formula parity between implementation and prototype scenarios

## 6. Quality and Readiness

- [ ] 6.1 Add architecture tests/checks to prevent adapters from owning business rules
- [ ] 6.2 Remove or refactor duplicated legacy calculation logic into the domain use case
- [ ] 6.3 Finalize technical documentation for contracts, assumptions, and open rounding/unit decisions
