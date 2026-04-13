import { DEFAULT_CALCULATION_POLICY } from "../policies/calculationPolicy.js";

const truncateToTwoDecimals = (value) => Math.trunc(value * 100) / 100;

export function calculateSprintValueDomain(
  input,
  policy = DEFAULT_CALCULATION_POLICY,
) {
  const dailyCapacity = input.developers * input.developmentHoursPerDay;
  const totalStoryEffort = input.storyPoints * input.pointValue;
  const technicalRefinementHours = policy.technicalRefinementHours;
  const refinedStoryEffort = totalStoryEffort + technicalRefinementHours;

  const rawRequiredDays = truncateToTwoDecimals(
    refinedStoryEffort / dailyCapacity,
  );
  const roundedRequiredDays = Math.ceil(rawRequiredDays);

  const rawRnfHours = truncateToTwoDecimals(
    refinedStoryEffort * policy.rnfPercentage,
  );
  const roundedRnfHours = Math.round(rawRnfHours);

  const hasRnfCapacity =
    Number.isFinite(policy.rnfDeveloperCount) && policy.rnfDeveloperCount > 0;

  const rnfDailyCapacity = hasRnfCapacity
    ? policy.rnfDeveloperCount * input.developmentHoursPerDay
    : 0;
  const rawRnfDays = hasRnfCapacity
    ? truncateToTwoDecimals(roundedRnfHours / rnfDailyCapacity)
    : 0;
  const roundedRnfDays = hasRnfCapacity ? Math.round(rawRnfDays) : 0;

  return {
    dailyCapacity,
    totalStoryEffort,
    technicalRefinementHours,
    refinedStoryEffort,
    rawRequiredDays,
    roundedRequiredDays,
    rawRnfHours,
    roundedRnfHours,
    rnfDailyCapacity,
    rawRnfDays,
    roundedRnfDays,
  };
}
