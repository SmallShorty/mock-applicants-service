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

  // Generate message with SNILS
  async generate(snils: string): Promise<IApplicantMessage> {
    if (this.allQuestions.length === 0) {
      await this.loadQuestions();
    }

    if (this.allQuestions.length === 0) {
      return {
        snils,
        content: 'У меня вопрос по поступлению',
      };
    }

    const randomIndex = Math.floor(Math.random() * this.allQuestions.length);
    const randomQuestion = this.allQuestions[randomIndex];

    return {
      snils,
      content: randomQuestion.text,
    };
  }

  // Generate random message without SNILS
  async generateRandom(): Promise<IApplicantMessage> {
    if (this.allQuestions.length === 0) {
      await this.loadQuestions();
    }

    if (this.allQuestions.length === 0) {
      return {
        content: 'У меня вопрос по поступлению',
      };
    }

    const randomIndex = Math.floor(Math.random() * this.allQuestions.length);
    const randomQuestion = this.allQuestions[randomIndex];

    return {
      content: randomQuestion.text,
    };
  }

  // Generate batch with SNILS array
  async generateBatch(
    snilsList: string[],
    messagesCount: number,
  ): Promise<IApplicantMessage[]> {
    if (this.allQuestions.length === 0) {
      await this.loadQuestions();
    }

    const messages: IApplicantMessage[] = [];

    for (let i = 0; i < messagesCount; i++) {
      const snils = faker.helpers.arrayElement(snilsList);
      const message = await this.generate(snils);
      messages.push(message);
    }

    return messages;
  }
}
