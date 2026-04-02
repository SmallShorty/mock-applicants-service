import { Injectable } from '@nestjs/common';
import { ApplicantGenerator } from './generators/applicant.generator';
import { MessageGenerator } from './generators/message.generator';
import { IApplicant, IApplicantMessage } from './interfaces/mock.interface';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class MockService {
  constructor(
    private applicantGenerator: ApplicantGenerator,
    private messageGenerator: MessageGenerator,
  ) {}

  // Generate single applicant and save to file
  async generateApplicant(): Promise<IApplicant> {
    const applicant = await this.applicantGenerator.generate();
    await this.saveApplicantToFile(applicant);
    return applicant;
  }

  // Generate multiple applicants
  async generateBatch(count: number): Promise<IApplicant[]> {
    const applicants: IApplicant[] = [];

    for (let i = 0; i < count; i++) {
      const applicant = await this.applicantGenerator.generate();
      await this.saveApplicantToFile(applicant);
      applicants.push(applicant);

      // Log progress every 10 applicants
      if ((i + 1) % 10 === 0) {
        console.log(`Generated ${i + 1}/${count} applicants`);
      }
    }

    // Save batch summary
    await this.saveBatchToFile(applicants, count);

    return applicants;
  }

  // Generate messages for applicants
  async generateMessages(
    snilsList: string[],
    count: number,
  ): Promise<IApplicantMessage[]> {
    const messages = await this.messageGenerator.generateBatch(
      snilsList,
      count,
    );
    await this.saveMessagesToFile(messages);
    return messages;
  }

  // Save single applicant to JSON file
  private async saveApplicantToFile(applicant: IApplicant): Promise<void> {
    const dateDir = new Date().toISOString().split('T')[0];
    const dirPath = path.join(
      process.cwd(),
      'mock-storage',
      'generated',
      'applicants',
      dateDir,
    );

    await fs.mkdir(dirPath, { recursive: true });

    const filePath = path.join(dirPath, `applicant_${applicant.id}.json`);
    await fs.writeFile(filePath, JSON.stringify(applicant, null, 2));
  }

  // Save batch summary
  private async saveBatchToFile(
    applicants: IApplicant[],
    count: number,
  ): Promise<void> {
    const batchDir = path.join(
      process.cwd(),
      'mock-storage',
      'generated',
      'batches',
    );
    await fs.mkdir(batchDir, { recursive: true });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filePath = path.join(batchDir, `batch_${timestamp}.json`);

    const batchSummary = {
      generatedAt: new Date().toISOString(),
      count: applicants.length,
      applicants: applicants.map((a) => ({ id: a.id, snils: a.snils })),
    };

    await fs.writeFile(filePath, JSON.stringify(batchSummary, null, 2));
  }

  // Save messages to file
  private async saveMessagesToFile(
    messages: IApplicantMessage[],
  ): Promise<void> {
    const dateDir = new Date().toISOString().split('T')[0];
    const dirPath = path.join(
      process.cwd(),
      'mock-storage',
      'generated',
      'messages',
      dateDir,
    );

    await fs.mkdir(dirPath, { recursive: true });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filePath = path.join(dirPath, `messages_${timestamp}.json`);

    await fs.writeFile(filePath, JSON.stringify(messages, null, 2));
  }
}
