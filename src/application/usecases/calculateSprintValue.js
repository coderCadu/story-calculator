import { DEFAULT_CALCULATION_POLICY } from "../../domain/policies/calculationPolicy.js";
import { calculateSprintValueDomain } from "../../domain/services/sprintValueCalculator.js";
import {
  createOutputContract,
  createValidationError,
  validateCalculationInput,
  validateCalculationPolicy,
} from "../contracts/sprintCalculationContracts.js";

export function calculateSprintValueUseCase(
  input,
  policy = DEFAULT_CALCULATION_POLICY,
) {
  const validation = validateCalculationInput(input);
  const effectivePolicy = { ...DEFAULT_CALCULATION_POLICY, ...policy };
  const policyValidation = validateCalculationPolicy(effectivePolicy);

  if (!validation.isValid || !policyValidation.isValid) {
    return {
      ok: false,
      error: createValidationError([
        ...validation.errors,
        ...policyValidation.errors,
      ]),
    };
  }

  const values = calculateSprintValueDomain(input, effectivePolicy);

  return {
    ok: true,
    data: createOutputContract(input, effectivePolicy, values),
  };
}
