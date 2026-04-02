import { Controller, Post, Body, Get } from '@nestjs/common';
import { MockService } from './mock.service';
import { IApplicant, IApplicantMessage } from './interfaces/mock.interface';

@Controller('mock')
export class MockController {
  constructor(private readonly mockService: MockService) {}

  // Generate single applicant
  @Post('applicant')
  async generateApplicant(): Promise<IApplicant> {
    return this.mockService.generateApplicant();
  }

  // Generate batch of applicants
  @Post('applicants/bulk')
  async generateBatch(@Body() body: { count: number }): Promise<IApplicant[]> {
    const count = body.count || 10;
    return this.mockService.generateBatch(count);
  }

  // Generate messages for applicants
  @Post('messages')
  @Post('messages')
  async generateMessages(
    @Body() body: { snilsList: string[]; count: number },
  ): Promise<IApplicantMessage[]> {
    const { snilsList, count } = body;
    return this.mockService.generateMessages(snilsList, count);
  }

  // Health check
  @Get('health')
  healthCheck(): { status: string } {
    return { status: 'ok' };
  }
}
