export default {
  probabilities: {
    hasBvi: 0.05,
    hasTargetQuota: 0.1,
    hasSpecialQuota: 0.03,
    hasSeparateQuota: 0.02,
    hasPriorityRight: 0.08,
  },
  scoreRanges: {
    high: { min: 80, max: 100, probability: 0.4 },
    medium: { min: 60, max: 79, probability: 0.4 },
    low: { min: 40, max: 59, probability: 0.2 },
  },
  programsCount: { min: 1, max: 5 },
  originalDocumentChance: 0.3,
};
