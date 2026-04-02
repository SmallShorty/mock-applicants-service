import { Injectable } from '@nestjs/common';
import {
  IAvailableProgram,
  ISelectedProgram,
} from '../interfaces/mock.interface';
import { PriorityStrategy } from '../strategies/priority.strategy';
import config from '../config/generation.config';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class ProgramGenerator {
  private availablePrograms: IAvailableProgram[] = [];

  constructor(private priorityStrategy: PriorityStrategy) {}

  // Load available programs from JSON file
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

  // Generate random selection of programs for an applicant
  async generate(quotas: any): Promise<ISelectedProgram[]> {
    if (this.availablePrograms.length === 0) {
      await this.loadPrograms();
    }

    const { min, max } = config.programsCount;
    const programsCount = Math.floor(Math.random() * (max - min + 1)) + min;

    // Shuffle available programs
    const shuffled = [...this.availablePrograms];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Select random programs
    const selected = shuffled.slice(0, programsCount);

    // Generate priorities for selected programs
    const priorities = this.priorityStrategy.generatePriorities(programsCount);

    // Build result with program details
    return selected.map((program, index) => ({
      programId: program.id,
      programCode: program.code,
      programName: program.name,
      studyForm: this.selectStudyForm(program, quotas),
      admissionType: this.selectAdmissionType(program, quotas),
      priority: priorities[index],
    }));
  }

  // Select study form based on quotas
  private selectStudyForm(program: IAvailableProgram, quotas: any): any {
    // Target quota often requires full-time study
    if (quotas.hasTargetQuota && program.studyForms.includes('full-time')) {
      return 'full-time';
    }
    // Random choice from available forms
    return program.studyForms[
      Math.floor(Math.random() * program.studyForms.length)
    ];
  }

  // Select admission type based on quotas
  private selectAdmissionType(program: IAvailableProgram, quotas: any): any {
    // Target quota priority
    if (quotas.hasTargetQuota && program.admissionTypes.includes('target')) {
      return 'target';
    }
    // BVI priority for budget
    if (quotas.hasBvi && program.admissionTypes.includes('budget')) {
      return 'budget';
    }
    // Random choice from available types
    return program.admissionTypes[
      Math.floor(Math.random() * program.admissionTypes.length)
    ];
  }
}
