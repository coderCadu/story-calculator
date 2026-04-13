import { calculateSprintValueUseCase } from "../../application/usecases/calculateSprintValue.js";

export function calculateSprintValueAdapter(
  payload,
  policy,
  execute = calculateSprintValueUseCase,
) {
  return execute(payload, policy);
}
