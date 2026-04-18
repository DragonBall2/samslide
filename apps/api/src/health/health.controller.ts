import { Controller, Get } from '@nestjs/common';
import { SlideKindSchema } from '@samslide/types';

@Controller('health')
export class HealthController {
  @Get()
  check(): {
    status: 'ok';
    service: string;
    version: string;
    timestamp: string;
    supportedSlideKinds: readonly string[];
  } {
    return {
      status: 'ok',
      service: 'samslide-api',
      version: process.env.APP_VERSION ?? '0.0.0-dev',
      timestamp: new Date().toISOString(),
      supportedSlideKinds: SlideKindSchema.options,
    };
  }
}
