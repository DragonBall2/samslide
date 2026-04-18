import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module.js';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug'],
  });
  app.enableShutdownHooks();

  const corsOrigins = (process.env.CORS_ORIGINS ?? 'http://localhost:3000,http://localhost:3002')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  const port = Number(process.env.PORT ?? 3001);
  await app.listen(port);

  const logger = new Logger('Bootstrap');
  logger.log(`samslide-api listening on http://localhost:${port}`);
  logger.log(`CORS origins: ${corsOrigins.join(', ')}`);
}

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to bootstrap samslide-api', err);
  process.exit(1);
});
