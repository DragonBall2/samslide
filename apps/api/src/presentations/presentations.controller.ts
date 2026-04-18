import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UsePipes,
} from '@nestjs/common';
import {
  CreatePresentationRequestSchema,
  UpdatePresentationRequestSchema,
  type CreatePresentationRequest,
  type Presentation,
  type PresentationListResponse,
  type UpdatePresentationRequest,
} from '@samslide/types';
import { ZodValidationPipe } from '../common/zod-validation.pipe.js';
import { PresentationsService } from './presentations.service.js';

@Controller('presentations')
export class PresentationsController {
  constructor(private readonly service: PresentationsService) {}

  @Get()
  list(): PresentationListResponse {
    return this.service.list();
  }

  @Get(':id')
  getOne(@Param('id', new ParseUUIDPipe()) id: string): Presentation {
    return this.service.getOne(id);
  }

  @Post()
  @UsePipes(new ZodValidationPipe(CreatePresentationRequestSchema))
  create(@Body() body: CreatePresentationRequest): Presentation {
    return this.service.create(body);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(new ZodValidationPipe(UpdatePresentationRequestSchema)) body: UpdatePresentationRequest,
  ): Presentation {
    return this.service.update(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', new ParseUUIDPipe()) id: string): void {
    this.service.remove(id);
  }
}
