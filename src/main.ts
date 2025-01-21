import { NestFactory } from '@nestjs/core';
import { moduleFactory } from './app.module';
import configuration from './config/configuration';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const defaulConfigService = configuration()
  const {
    database: {
      typeorm: { host, port, username, password },
    }
  } = defaulConfigService;
  const app = await NestFactory.create<NestExpressApplication>(moduleFactory({
    host, port, username, password
  }))
  const configService = app.get(ConfigService)
  app.useStaticAssets(join(__dirname, '..', 'uploads'), { prefix: '/images', })
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: false, transform: true
    })
  );
  await app.listen(configService.get('APP_PORT'));

  console.info(
    `Server started at http://localhost:${configService.get('APP_PORT')}`,
  )
}
bootstrap();
