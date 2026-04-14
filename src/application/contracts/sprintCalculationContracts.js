export const OUTPUT_LABELS = Object.freeze({
  dailyCapacity: "Capacidade diaria",
  technicalRefinementHours: "Refinamento tecnico",
  totalStoryEffort: "Esforco total da historia",
  refinedStoryEffort: "Com refinamento tecnico",
  requiredStoryDays: "Numero de dias necessarios",
  rnfHours: "RNF 30%",
  rnfDays: "Dias de RNF",
});

const REQUIRED_FIELDS = Object.freeze([
  "developers",
  "developmentHoursPerDay",
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

  const policyFields = ["technicalRefinementHours", "rnfDeveloperCount"];

  for (const field of policyFields) {
    const value = policy[field];

    if (field === "rnfDeveloperCount") {
      if (typeof value !== "number") {
        errors.push({
          field,
          code: "INVALID_NUMBER",
          message: `Field '${field}' must be a number.`,
        });
        continue;
      }

      if (Number.isNaN(value)) {
        continue;
      }

      if (!Number.isFinite(value)) {
        errors.push({
          field,
          code: "INVALID_NUMBER",
          message: `Field '${field}' must be a finite number.`,
        });
        continue;
      }

      if (value < 0) {
        errors.push({
          field,
          code: "NON_POSITIVE_VALUE",
          message: `Field '${field}' must be zero or greater.`,
        });
      }

      continue;
    }

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
  return {
    input,
    policy,
    output: {
      dailyCapacity: {
        label: OUTPUT_LABELS.dailyCapacity,
        formula: "developers * developmentHoursPerDay",
        value: values.dailyCapacity,
      },
      technicalRefinementHours: {
        label: OUTPUT_LABELS.technicalRefinementHours,
        formula: "technicalRefinementHours",
        value: values.technicalRefinementHours,
      },
      totalStoryEffort: {
        label: OUTPUT_LABELS.totalStoryEffort,
        formula: "storyPoints * pointValue",
        value: values.totalStoryEffort,
      },
      refinedStoryEffort: {
        label: OUTPUT_LABELS.refinedStoryEffort,
        formula: "totalStoryEffort + technicalRefinementHours",
        value: values.refinedStoryEffort,
      },
      requiredStoryDays: {
        label: OUTPUT_LABELS.requiredStoryDays,
        formula: "refinedStoryEffort / dailyCapacity (ceil)",
        raw: values.rawRequiredDays,
        value: values.roundedRequiredDays,
      },
      rnfHours: {
        label: OUTPUT_LABELS.rnfHours,
        formula: "dailyCapacity * rnfPercentage (nearest integer)",
        raw: values.rawRnfHours,
        value: values.roundedRnfHours,
      },
      rnfDays: {
        label: OUTPUT_LABELS.rnfDays,
        formula:
          "roundedRnfHours / (rnfDeveloperCount * developmentHoursPerDay) (nearest integer)",
        raw: values.rawRnfDays,
        value: values.roundedRnfDays,
      },
    },
  };
}
