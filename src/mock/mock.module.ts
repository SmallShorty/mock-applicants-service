import { Module } from '@nestjs/common';
import { MockController } from './mock.controller';
import { MockService } from './mock.service';
import { ApplicantGenerator } from './generators/applicant.generator';
import { ExamScoresGenerator } from './generators/exam-scores.generator';
import { MessageGenerator } from './generators/message.generator';
import { ProgramGenerator } from './generators/program.generator';
import { PriorityStrategy } from './strategies/priority.strategy';
import { QuotaStrategy } from './strategies/quota.strategy';
import { ScoreDistributionStrategy } from './strategies/score-distribution.strategy';

@Module({
  controllers: [MockController],
  providers: [
    MockService,
    QuotaStrategy,
    PriorityStrategy,
    ScoreDistributionStrategy,
    ApplicantGenerator,
    ProgramGenerator,
    ExamScoresGenerator,
    MessageGenerator,
  ],
})
export class MockModule {}
