import { Injectable } from '@nestjs/common';

@Injectable()
export class MockService {
  getHello(): string {
    return 'Mock service is working!';
  }
}
