import { calculateSprintCapacity } from './sprintCapacityCalculator.js';
import { calculateStoryEffort } from './storyEffortCalculator.js';
import { calculateSprintIntegration } from './sprintIntegrationCalculator.js';

/**
 * Main orchestrator for unified sprint metrics calculation
 * Composes three-phase pipeline: capacity → effort → integration
 * 
 * @param {Object} input - Combined sprint and story configuration
 * @param {number} input.developers - Total developers
 * @param {number} input.developmentHoursPerDay - Hours per day
 * @param {number} input.sprintDurationDays - Sprint duration
 * @param {boolean} input.hasRnf - Whether to allocate RNF resources (default: false)
 * @param {number} input.storyPoints - Story points
 * @param {number} input.pointValue - Hours per point
 * @param {Object} policy - Calculation policy
 * @param {number} policy.technicalRefinementHours - Technical refinement hours
 * @param {number} policy.rnfPercentage - RNF percentage (for transparency)
 * @returns {Object} Unified sprint metrics
 */
export function calculateSprintMetrics(input, policy) {
  const { hasRnf = false, sprintDurationDays } = input;
  
  // Phase 1: Sprint Capacity (Top-Down)
  const capacityMetrics = calculateSprintCapacity(input, hasRnf);
  
  // Phase 2: Story Effort (Bottom-Up)
  const effortMetrics = calculateStoryEffort(input, policy);
  
  // Phase 3: Integration
  const integrationMetrics = calculateSprintIntegration(
    effortMetrics,
    capacityMetrics,
    sprintDurationDays
  );
  
  // Compose unified output
  return {
    ...capacityMetrics,
    ...effortMetrics,
    ...integrationMetrics,
  };
}
