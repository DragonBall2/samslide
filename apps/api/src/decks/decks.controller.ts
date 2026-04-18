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
  CreateDeckRequestSchema,
  UpdateDeckRequestSchema,
  type CreateDeckRequest,
  type Deck,
  type DeckListResponse,
  type UpdateDeckRequest,
} from '@samslide/types';
import { ZodValidationPipe } from '../common/zod-validation.pipe.js';
import { DecksService } from './decks.service.js';

@Controller('decks')
export class DecksController {
  constructor(private readonly service: DecksService) {}

  @Get()
  list(): DeckListResponse {
    return this.service.list();
  }

  @Get(':id')
  getOne(@Param('id', new ParseUUIDPipe()) id: string): Deck {
    return this.service.getOne(id);
  }

  @Post()
  @UsePipes(new ZodValidationPipe(CreateDeckRequestSchema))
  create(@Body() body: CreateDeckRequest): Deck {
    return this.service.create(body);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(new ZodValidationPipe(UpdateDeckRequestSchema)) body: UpdateDeckRequest,
  ): Deck {
    return this.service.update(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', new ParseUUIDPipe()) id: string): void {
    this.service.remove(id);
  }
}
