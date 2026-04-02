import { Injectable } from '@nestjs/common';

@Injectable()
export class PriorityStrategy {
  generatePriorities(count: number): number[] {
    const priorities = Array.from({ length: count }, (_, i) => i + 1);

    for (let i = priorities.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [priorities[i], priorities[j]] = [priorities[j], priorities[i]];
    }

    return priorities;
  }
}
