import { Injectable } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { IApplicantMessage } from '../interfaces/mock.interface';
import * as fs from 'fs/promises';
import * as path from 'path';

interface IQuestion {
  id: string;
  text: string;
}

@Injectable()
export class MessageGenerator {
  private allQuestions: IQuestion[] = [];

  // Load all question files from templates folder
  async loadQuestions(): Promise<void> {
    const questionsDir = path.join(
      process.cwd(),
      'mock-storage',
      'templates',
      'questions',
    );

    try {
      const files = await fs.readdir(questionsDir);

      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = path.join(questionsDir, file);
          const content = await fs.readFile(filePath, 'utf-8');
          const questions = JSON.parse(content);
          this.allQuestions.push(...questions);
        }
      }
    } catch (error) {
      console.error('Failed to load questions:', error);
    }
  }

  // Generate a single message for an applicant
  async generate(applicantId: string): Promise<IApplicantMessage> {
    if (this.allQuestions.length === 0) {
      await this.loadQuestions();
    }

    // Check if questions exist
    if (this.allQuestions.length === 0) {
      return {
        applicantId,
        content: 'У меня вопрос по поступлению',
      };
    }

    // Get random question
    const randomIndex = Math.floor(Math.random() * this.allQuestions.length);
    const randomQuestion = this.allQuestions[randomIndex];

    return {
      applicantId,
      content: randomQuestion.text,
    };
  }

  // Generate multiple messages in batch
  async generateBatch(
    applicantIds: string[],
    messagesCount: number,
  ): Promise<IApplicantMessage[]> {
    if (this.allQuestions.length === 0) {
      await this.loadQuestions();
    }

    const messages: IApplicantMessage[] = [];

    for (let i = 0; i < messagesCount; i++) {
      const applicantId = faker.helpers.arrayElement(applicantIds);
      const message = await this.generate(applicantId);
      messages.push(message);
    }

    return messages;
  }
}
