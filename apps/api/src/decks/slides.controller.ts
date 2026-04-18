import {
  Body,
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  CreateSlideRequestSchema,
  ReorderSlidesRequestSchema,
  UpdateSlideRequestSchema,
  type CreateSlideRequest,
  type ReorderSlidesRequest,
  type Slide,
  type UpdateSlideRequest,
} from '@samslide/types';
import { ZodValidationPipe } from '../common/zod-validation.pipe.js';
import { DecksRepository } from './decks.repository.js';

@Controller('decks/:deckId/slides')
export class SlidesController {
  constructor(private readonly repo: DecksRepository) {}

  @Post()
  create(
    @Param('deckId', new ParseUUIDPipe()) deckId: string,
    @Body(new ZodValidationPipe(CreateSlideRequestSchema)) body: CreateSlideRequest,
  ): Slide {
    const slide = this.repo.addSlide(deckId, body);
    if (!slide) throw new NotFoundException(`deck not found: ${deckId}`);
    return slide;
  }

  @Patch(':slideId')
  update(
    @Param('deckId', new ParseUUIDPipe()) deckId: string,
    @Param('slideId', new ParseUUIDPipe()) slideId: string,
    @Body(new ZodValidationPipe(UpdateSlideRequestSchema)) body: UpdateSlideRequest,
  ): Slide {
    const slide = this.repo.updateSlide(deckId, slideId, body);
    if (!slide) throw new NotFoundException(`slide not found: ${deckId}/${slideId}`);
    return slide;
  }

  @Delete(':slideId')
  @HttpCode(204)
  remove(
    @Param('deckId', new ParseUUIDPipe()) deckId: string,
    @Param('slideId', new ParseUUIDPipe()) slideId: string,
  ): void {
    const ok = this.repo.removeSlide(deckId, slideId);
    if (!ok) throw new NotFoundException(`slide not found: ${deckId}/${slideId}`);
  }

  @Post('reorder')
  reorder(
    @Param('deckId', new ParseUUIDPipe()) deckId: string,
    @Body(new ZodValidationPipe(ReorderSlidesRequestSchema)) body: ReorderSlidesRequest,
  ): { slides: Slide[] } {
    const slides = this.repo.reorderSlides(deckId, body.slideIds);
    if (!slides) {
      throw new NotFoundException(
        `reorder failed: deck ${deckId} not found, or slideIds did not exactly match existing slides`,
      );
    }
    return { slides };
  }
}
