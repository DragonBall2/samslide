import { Module } from '@nestjs/common';
import { PresentationsController } from './presentations.controller.js';
import { PresentationsRepository } from './presentations.repository.js';
import { PresentationsService } from './presentations.service.js';
import { SlidesController } from './slides.controller.js';

@Module({
  controllers: [PresentationsController, SlidesController],
  providers: [PresentationsService, PresentationsRepository],
  exports: [PresentationsService],
})
export class PresentationsModule {}
