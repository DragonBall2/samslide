import { Module } from '@nestjs/common';
import { DecksModule } from './decks/decks.module.js';
import { HealthModule } from './health/health.module.js';

@Module({
  imports: [HealthModule, DecksModule],
})
export class AppModule {}
