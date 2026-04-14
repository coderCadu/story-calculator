const truncateToTwoDecimals = (value) => Math.trunc(value * 100) / 100;

/**
 * Allocate developers to RNF work using mathematical optimization
 * Finds X devs where (X × hoursPerDay × sprintDays) ≤ 30% of total capacity
 * and is as close to 30% as possible
 * 
 * @param {number} totalDevs - Total developers available
 * @param {number} hoursPerDay - Development hours per day
 * @param {number} sprintDays - Sprint duration in days
 * @returns {{devs: number, hours: number}} Allocated devs and hours
 */
function allocateRnfDevelopers(totalDevs, hoursPerDay, sprintDays) {
  // Edge case: Can't allocate if only 1 dev total
  if (totalDevs <= 1) {
    return { devs: 0, hours: 0 };
  }
  
  const totalCapacity = totalDevs * hoursPerDay * sprintDays;
  const rnfTarget = totalCapacity * 0.30;
  const devCapacity = hoursPerDay * sprintDays;
  
  // Direct mathematical calculation
  const idealDevs = rnfTarget / devCapacity;
  const allocatedDevs = Math.floor(idealDevs);
  
  // Constraints:
  // - Minimum: 0 (if team too small, RNF simply doesn't happen)
  // - Maximum: totalDevs - 1 (must leave at least 1 for functional)
  const finalDevs = Math.max(0, Math.min(allocatedDevs, totalDevs - 1));
  const allocatedHours = finalDevs * hoursPerDay * sprintDays;
  
  return { devs: finalDevs, hours: allocatedHours };
}

/**
 * Calculate sprint capacity including total capacity and RNF allocation
 * 
 * @param {Object} input - Sprint configuration
 * @param {number} input.developers - Total developers
 * @param {number} input.developmentHoursPerDay - Hours per day
 * @param {number} input.sprintDurationDays - Sprint duration
 * @param {boolean} hasRnf - Whether to allocate RNF resources
 * @returns {Object} Sprint capacity metrics
 */
export function calculateSprintCapacity(input, hasRnf) {
  const { developers, developmentHoursPerDay, sprintDurationDays } = input;
  
  const totalSprintCapacity = developers * developmentHoursPerDay * sprintDurationDays;
  const totalDailyCapacity = developers * developmentHoursPerDay;
  
  // Always return base output
  const baseOutput = {
    totalSprintCapacity,
    totalDailyCapacity,
  };
  
  if (!hasRnf) {
    // No RNF - all devs are functional
    return {
      ...baseOutput,
      functionalDevs: developers,
      functionalSprintCapacity: totalSprintCapacity,
      functionalDailyCapacity: totalDailyCapacity,
    };
  }
  
  // RNF requested - try to allocate
  const rnfTargetHours = totalSprintCapacity * 0.30;
  const rnfAllocation = allocateRnfDevelopers(
    developers,
    developmentHoursPerDay,
    sprintDurationDays
  );
  
  const functionalDevs = developers - rnfAllocation.devs;
  const functionalSprintCapacity = functionalDevs * developmentHoursPerDay * sprintDurationDays;
  const functionalDailyCapacity = functionalDevs * developmentHoursPerDay;
  
  // Smart omission: only include RNF fields if allocation succeeded
  if (rnfAllocation.devs > 0) {
    const rnfPercentageActual = (rnfAllocation.hours / totalSprintCapacity) * 100;
    
    return {
      ...baseOutput,
      rnfTargetHours,
      rnfAllocatedDevs: rnfAllocation.devs,
      rnfAllocatedHours: rnfAllocation.hours,
      rnfPercentageActual: truncateToTwoDecimals(rnfPercentageActual),
      functionalDevs,
      functionalSprintCapacity,
      functionalDailyCapacity,
    };
  } else {
    // Allocation failed (team too small)
    // Output looks like hasRnf=false (no RNF fields)
    return {
      ...baseOutput,
      functionalDevs: developers,
      functionalSprintCapacity: totalSprintCapacity,
      functionalDailyCapacity: totalDailyCapacity,
    };
  }
}
