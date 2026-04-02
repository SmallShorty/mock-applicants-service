import { Injectable } from '@nestjs/common';
import { IQuotas } from '../interfaces/mock.interface';
import config from '../config/generation.config';

@Injectable()
export class QuotaStrategy {
  generate(): IQuotas {
    const { probabilities } = config;

    return {
      hasBvi: Math.random() < probabilities.hasBvi,
      hasSpecialQuota: Math.random() < probabilities.hasSpecialQuota,
      hasSeparateQuota: Math.random() < probabilities.hasSeparateQuota,
      hasTargetQuota: Math.random() < probabilities.hasTargetQuota,
      hasPriorityRight: Math.random() < probabilities.hasPriorityRight,
    };
  }
}
