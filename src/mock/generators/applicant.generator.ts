import { Injectable } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { IApplicant, IQuotas } from '../interfaces/mock.interface';
import { QuotaStrategy } from '../strategies/quota.strategy';
import { ProgramGenerator } from './program.generator';
import { ExamScoresGenerator } from './exam-scores.generator';
import config from '../config/generation.config';

@Injectable()
export class ApplicantGenerator {
  constructor(
    private quotaStrategy: QuotaStrategy,
    private programGenerator: ProgramGenerator,
    private examScoresGenerator: ExamScoresGenerator,
  ) {}

  // Generate a single applicant
  async generate(forceQuotas?: Partial<IQuotas>): Promise<IApplicant> {
    // Generate quotas (or use forced ones)
    const quotas = forceQuotas
      ? { ...this.quotaStrategy.generate(), ...forceQuotas }
      : this.quotaStrategy.generate();

    // Generate selected programs
    const selectedPrograms = await this.programGenerator.generate(quotas);

    // Generate exam scores based on selected programs
    const examScores = await this.examScoresGenerator.generate(
      selectedPrograms,
      quotas.hasBvi,
    );

    // Generate original document status
    const hasOriginalDocument = Math.random() < config.originalDocumentChance;

    // Build applicant object
    return {
      id: faker.string.uuid(),
      personalInfo: {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        patronymic: faker.person.middleName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
      },
      snils: this.generateSnils(),
      quotas,
      documents: {
        originalDocumentReceived: hasOriginalDocument,
        originalDocumentReceivedAt: hasOriginalDocument
          ? faker.date.recent().toISOString()
          : undefined,
      },
      examScores,
      selectedPrograms,
      createdAt: new Date().toISOString(),
    };
  }

  // Generate SNILS in format XXX-XXX-XXX XX
  private generateSnils(): string {
    const numbers = faker.string.numeric(11);
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6, 9)} ${numbers.slice(9, 11)}`;
  }
}
