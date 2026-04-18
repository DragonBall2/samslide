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
import { PresentationsRepository } from './presentations.repository.js';

@Controller('presentations/:presentationId/slides')
export class SlidesController {
  constructor(private readonly repo: PresentationsRepository) {}

  @Post()
  create(
    @Param('presentationId', new ParseUUIDPipe()) presentationId: string,
    @Body(new ZodValidationPipe(CreateSlideRequestSchema)) body: CreateSlideRequest,
  ): Slide {
    const slide = this.repo.addSlide(presentationId, body);
    if (!slide) throw new NotFoundException(`presentation not found: ${presentationId}`);
    return slide;
  }

  @Patch(':slideId')
  update(
    @Param('presentationId', new ParseUUIDPipe()) presentationId: string,
    @Param('slideId', new ParseUUIDPipe()) slideId: string,
    @Body(new ZodValidationPipe(UpdateSlideRequestSchema)) body: UpdateSlideRequest,
  ): Slide {
    const slide = this.repo.updateSlide(presentationId, slideId, body);
    if (!slide)
      throw new NotFoundException(`slide not found: ${presentationId}/${slideId}`);
    return slide;
  }

  @Delete(':slideId')
  @HttpCode(204)
  remove(
    @Param('presentationId', new ParseUUIDPipe()) presentationId: string,
    @Param('slideId', new ParseUUIDPipe()) slideId: string,
  ): void {
    const ok = this.repo.removeSlide(presentationId, slideId);
    if (!ok) throw new NotFoundException(`slide not found: ${presentationId}/${slideId}`);
  }

  @Post('reorder')
  reorder(
    @Param('presentationId', new ParseUUIDPipe()) presentationId: string,
    @Body(new ZodValidationPipe(ReorderSlidesRequestSchema)) body: ReorderSlidesRequest,
  ): { slides: Slide[] } {
    const slides = this.repo.reorderSlides(presentationId, body.slideIds);
    if (!slides) {
      throw new NotFoundException(
        `reorder failed: presentation ${presentationId} not found, or slideIds did not exactly match existing slides`,
      );
    }
    return { slides };
  }
}
