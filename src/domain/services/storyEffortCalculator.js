/**
 * Calculate story effort including base effort and technical refinement
 * 
 * @param {Object} input - Story configuration
 * @param {number} input.storyPoints - Story points
 * @param {number} input.pointValue - Hours per point
 * @param {Object} policy - Calculation policy
 * @param {number} policy.technicalRefinementHours - Technical refinement hours
 * @returns {Object} Story effort metrics
 */
export function calculateStoryEffort(input, policy) {
  const { storyPoints, pointValue } = input;
  const { technicalRefinementHours } = policy;
  
  const baseStoryEffort = storyPoints * pointValue;
  const refinedStoryEffort = baseStoryEffort + technicalRefinementHours;
  
  return {
    baseStoryEffort,
    technicalRefinementHours,
    refinedStoryEffort,
  };
}
