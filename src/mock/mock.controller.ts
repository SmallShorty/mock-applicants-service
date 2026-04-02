import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { MockService } from './mock.service';
import { IApplicant, IApplicantMessage } from './interfaces/mock.interface';

@Controller('mock')
export class MockController {
  constructor(private readonly mockService: MockService) {}

  // Generate applicant by SNILS
  @Post('applicant')
  async generateApplicant(
    @Body() body: { snils: string },
  ): Promise<IApplicant> {
    return this.mockService.generateApplicantBySnils(body.snils);
  }

  // Generate messages for applicants by SNILS list
  @Post('messages')
  async generateMessages(
    @Body() body: { snilsList: string[]; count: number },
  ): Promise<IApplicantMessage[]> {
    const { snilsList, count } = body;
    return this.mockService.generateMessages(snilsList, count);
  }

  // Generate random message without SNILS
  @Get('message/random')
  async generateRandomMessage(): Promise<IApplicantMessage> {
    return this.mockService.generateRandomMessage();
  }

  // Health check
  @Get('health')
  healthCheck(): { status: string } {
    return { status: 'ok' };
  }
}
