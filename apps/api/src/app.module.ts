import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module.js';
import { PresentationsModule } from './presentations/presentations.module.js';

@Module({
  imports: [HealthModule, PresentationsModule],
})
export class AppModule {}
