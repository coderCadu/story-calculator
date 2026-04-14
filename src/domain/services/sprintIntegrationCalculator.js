export const truncateToTwoDecimals = (value) => Math.trunc(value * 100) / 100;

/**
 * Calculate sprint integration metrics including required days and fit analysis
 * 
 * @param {Object} storyEffort - Story effort metrics
 * @param {number} storyEffort.refinedStoryEffort - Refined story effort
 * @param {Object} sprintCapacity - Sprint capacity metrics
 * @param {number} sprintCapacity.functionalDailyCapacity - Functional daily capacity
 * @param {number} sprintDurationDays - Sprint duration in days
 * @returns {Object} Integration metrics
 */
export function calculateSprintIntegration(storyEffort, sprintCapacity, sprintDurationDays) {
  const { refinedStoryEffort } = storyEffort;
  const { functionalDailyCapacity } = sprintCapacity;
  
  const rawRequiredDays = truncateToTwoDecimals(
    refinedStoryEffort / functionalDailyCapacity
  );
  const roundedRequiredDays = Math.ceil(rawRequiredDays);
  
  const fitsInSprint = roundedRequiredDays <= sprintDurationDays;
  const remainingDays = sprintDurationDays - roundedRequiredDays;
  
  return {
    rawRequiredDays,
    roundedRequiredDays,
    sprintDurationDays,
    fitsInSprint,
    remainingDays,
  };
}
