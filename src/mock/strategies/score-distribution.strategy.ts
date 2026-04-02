import { Injectable } from '@nestjs/common';
import config from '../config/generation.config';

@Injectable()
export class ScoreDistributionStrategy {
  // Generate a single exam score based on configured probability ranges
  generateScore(): number {
    const { scoreRanges } = config;
    const random = Math.random();

    let cumulativeProbability = 0;

    // Determine which range to use based on probability
    for (const [, range] of Object.entries(scoreRanges)) {
      cumulativeProbability += range.probability;
      if (random <= cumulativeProbability) {
        // Generate random score within the selected range
        return (
          Math.floor(Math.random() * (range.max - range.min + 1)) + range.min
        );
      }
    }

    // Fallback to medium score
    return 70;
  }

  // Generate scores for all required subjects
  generateScoresForSubjects(
    subjects: string[],
    hasBvi: boolean,
  ): Map<string, number> {
    const scores = new Map<string, number>();

    for (const subject of subjects) {
      if (hasBvi) {
        // BVI gives maximum score
        scores.set(subject, 100);
      } else {
        scores.set(subject, this.generateScore());
      }
    }

    return scores;
  }
}
