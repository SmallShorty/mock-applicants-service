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
  async generateMessages(
    @Body() body: { applicantIds: string[]; count: number },
  ): Promise<IApplicantMessage[]> {
    const { applicantIds, count } = body;
    return this.mockService.generateMessages(applicantIds, count);
  }

  // Health check
  @Get('health')
  healthCheck(): { status: string } {
    return { status: 'ok' };
  }
}
