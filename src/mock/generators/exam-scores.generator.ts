import { Injectable } from '@nestjs/common';
import {
  IExamScore,
  ISelectedProgram,
  IAvailableProgram,
} from '../interfaces/mock.interface';
import { ScoreDistributionStrategy } from '../strategies/score-distribution.strategy';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class ExamScoresGenerator {
  private availablePrograms: IAvailableProgram[] = [];

  constructor(private scoreStrategy: ScoreDistributionStrategy) {}

  // Load programs to get required subjects
  async loadPrograms(): Promise<void> {
    const programsPath = path.join(
      process.cwd(),
      'mock-storage',
      'templates',
      'programs',
      'available.json',
    );
    const content = await fs.readFile(programsPath, 'utf-8');
    this.availablePrograms = JSON.parse(content);
  }

  // Generate exam scores based on selected programs
  async generate(
    selectedPrograms: ISelectedProgram[],
    hasBvi: boolean,
  ): Promise<IExamScore[]> {
    if (this.availablePrograms.length === 0) {
      await this.loadPrograms();
    }

    // Collect all required subjects from selected programs
    const requiredSubjects = new Set<string>();
    for (const selected of selectedPrograms) {
      const program = this.availablePrograms.find(
        (p) => p.id === selected.programId,
      );
      if (program) {
        program.requiredSubjects.forEach((subject) =>
          requiredSubjects.add(subject),
        );
      }
    }

    // Generate scores for each subject
    const subjects = Array.from(requiredSubjects);
    const scoresMap = this.scoreStrategy.generateScoresForSubjects(
      subjects,
      hasBvi,
    );

    // Convert to array format with type
    const examScores: IExamScore[] = [];
    scoresMap.forEach((score, subjectName) => {
      // Randomly assign exam type
      const types: IExamScore['type'][] = ['ege', 'internal'];
      const randomType = types[Math.floor(Math.random() * types.length)];

      examScores.push({
        subjectName,
        score,
        type: randomType,
      });
    });

    return examScores;
  }
}
