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

  // Generate applicant by SNILS (main method)
  async generateApplicantBySnils(snils: string): Promise<IApplicant> {
    const applicant = await this.applicantGenerator.generateBySnils(snils);
    await this.saveApplicantToFile(applicant);
    return applicant;
  }

  // Generate messages by SNILS
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

  // Generate random message without SNILS
  async generateRandomMessage(): Promise<IApplicantMessage> {
    return this.messageGenerator.generateRandom();
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

    // Use SNILS in filename for easy lookup
    const snilsSafe = applicant.snils.replace(/[\s-]/g, '_');
    const filePath = path.join(dirPath, `applicant_${snilsSafe}.json`);
    await fs.writeFile(filePath, JSON.stringify(applicant, null, 2));
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
