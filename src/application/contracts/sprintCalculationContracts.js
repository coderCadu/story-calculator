export const OUTPUT_LABELS = Object.freeze({
  totalSprintCapacity: "Capacidade total do sprint",
  totalDailyCapacity: "Capacidade diária total",
  rnfTargetHours: "RNF meta (30%)",
  rnfAllocatedDevs: "Devs alocados para RNF",
  rnfAllocatedHours: "Horas alocadas para RNF",
  rnfPercentageActual: "RNF percentual real",
  functionalDevs: "Devs funcionais",
  functionalSprintCapacity: "Capacidade funcional do sprint",
  functionalDailyCapacity: "Capacidade diária funcional",
  baseStoryEffort: "Esforço base da história",
  technicalRefinementHours: "Refinamento técnico",
  refinedStoryEffort: "Com refinamento técnico",
  requiredStoryDays: "Número de dias necessários",
  sprintDurationDays: "Duração do sprint (dias)",
  fitsInSprint: "Cabe no sprint",
  remainingDays: "Dias restantes",
});

const REQUIRED_FIELDS = Object.freeze([
  "developers",
  "developmentHoursPerDay",
  "sprintDurationDays",
  "storyPoints",
  "pointValue",
]);

export function validateCalculationInput(input) {
  const errors = [];

  for (const field of REQUIRED_FIELDS) {
    if (!(field in input)) {
      errors.push({
        field,
        code: "MISSING_REQUIRED_FIELD",
        message: `Field '${field}' is required.`,
      });
      continue;
    }

    const value = input[field];
    if (
      typeof value !== "number" ||
      Number.isNaN(value) ||
      !Number.isFinite(value)
    ) {
      errors.push({
        field,
        code: "INVALID_NUMBER",
        message: `Field '${field}' must be a finite number.`,
      });
      continue;
    }

    if (value <= 0) {
      errors.push({
        field,
        code: "NON_POSITIVE_VALUE",
        message: `Field '${field}' must be greater than zero.`,
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateCalculationPolicy(policy) {
  const errors = [];

  const policyFields = ["technicalRefinementHours"];

  for (const field of policyFields) {
    const value = policy[field];

    if (
      typeof value !== "number" ||
      Number.isNaN(value) ||
      !Number.isFinite(value)
    ) {
      errors.push({
        field,
        code: "INVALID_NUMBER",
        message: `Field '${field}' must be a finite number.`,
      });
      continue;
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function createValidationError(errors) {
  return {
    code: "VALIDATION_ERROR",
    message: "Input validation failed.",
    details: errors,
  };
}

export function createOutputContract(input, policy, values) {
  const output = {
    totalSprintCapacity: {
      label: OUTPUT_LABELS.totalSprintCapacity,
      formula: "developers * developmentHoursPerDay * sprintDurationDays",
      value: values.totalSprintCapacity,
    },
    totalDailyCapacity: {
      label: OUTPUT_LABELS.totalDailyCapacity,
      formula: "developers * developmentHoursPerDay",
      value: values.totalDailyCapacity,
    },
  };

  // Add RNF fields only if allocated
  if (values.rnfAllocatedDevs !== undefined) {
    output.rnfTargetHours = {
      label: OUTPUT_LABELS.rnfTargetHours,
      formula: "totalSprintCapacity * 0.30",
      value: values.rnfTargetHours,
    };
    output.rnfAllocatedDevs = {
      label: OUTPUT_LABELS.rnfAllocatedDevs,
      formula: "floor(rnfTargetHours / (developmentHoursPerDay * sprintDurationDays))",
      value: values.rnfAllocatedDevs,
    };
    output.rnfAllocatedHours = {
      label: OUTPUT_LABELS.rnfAllocatedHours,
      formula: "rnfAllocatedDevs * developmentHoursPerDay * sprintDurationDays",
      value: values.rnfAllocatedHours,
    };
    output.rnfPercentageActual = {
      label: OUTPUT_LABELS.rnfPercentageActual,
      formula: "(rnfAllocatedHours / totalSprintCapacity) * 100",
      value: values.rnfPercentageActual,
    };
  }

  // Functional capacity fields (always present)
  output.functionalDevs = {
    label: OUTPUT_LABELS.functionalDevs,
    formula: values.rnfAllocatedDevs !== undefined 
      ? "developers - rnfAllocatedDevs" 
      : "developers",
    value: values.functionalDevs,
  };
  output.functionalSprintCapacity = {
    label: OUTPUT_LABELS.functionalSprintCapacity,
    formula: "functionalDevs * developmentHoursPerDay * sprintDurationDays",
    value: values.functionalSprintCapacity,
  };
  output.functionalDailyCapacity = {
    label: OUTPUT_LABELS.functionalDailyCapacity,
    formula: "functionalDevs * developmentHoursPerDay",
    value: values.functionalDailyCapacity,
  };

  // Story effort fields
  output.baseStoryEffort = {
    label: OUTPUT_LABELS.baseStoryEffort,
    formula: "storyPoints * pointValue",
    value: values.baseStoryEffort,
  };
  output.technicalRefinementHours = {
    label: OUTPUT_LABELS.technicalRefinementHours,
    formula: "technicalRefinementHours",
    value: values.technicalRefinementHours,
  };
  output.refinedStoryEffort = {
    label: OUTPUT_LABELS.refinedStoryEffort,
    formula: "baseStoryEffort + technicalRefinementHours",
    value: values.refinedStoryEffort,
  };

  // Integration fields
  output.requiredStoryDays = {
    label: OUTPUT_LABELS.requiredStoryDays,
    formula: "refinedStoryEffort / functionalDailyCapacity (ceil)",
    raw: values.rawRequiredDays,
    value: values.roundedRequiredDays,
  };
  output.sprintDurationDays = {
    label: OUTPUT_LABELS.sprintDurationDays,
    formula: "sprintDurationDays",
    value: values.sprintDurationDays,
  };
  output.fitsInSprint = {
    label: OUTPUT_LABELS.fitsInSprint,
    formula: "roundedRequiredDays <= sprintDurationDays",
    value: values.fitsInSprint,
  };
  output.remainingDays = {
    label: OUTPUT_LABELS.remainingDays,
    formula: "sprintDurationDays - roundedRequiredDays",
    value: values.remainingDays,
  };

  return {
    input,
    policy,
    output,
  };
}
