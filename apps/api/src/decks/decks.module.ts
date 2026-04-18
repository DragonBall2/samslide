import { Module } from '@nestjs/common';
import { DecksController } from './decks.controller.js';
import { DecksRepository } from './decks.repository.js';
import { DecksService } from './decks.service.js';
import { SlidesController } from './slides.controller.js';

@Module({
  controllers: [DecksController, SlidesController],
  providers: [DecksService, DecksRepository],
  exports: [DecksService],
})
export class DecksModule {}
