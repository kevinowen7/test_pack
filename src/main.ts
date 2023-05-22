import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestExceptionFilter } from './common/exception/bad-request-exception.filter';
import { InternalServerErrorExceptionFilter } from './common/exception/internal-server-error-exception-filter';
import { NotFoundExceptionFilter } from './common/exception/not-found-exception.filter';
import { ForbiddenExceptionFilter } from './common/exception/forbidden-exception.filter';
import { UnauthorizeExceptionFilter } from './common/exception/unauthorize-exception.filter';
import * as fs from 'fs';

async function bootstrap() {

  const app = fs.existsSync('.secrets/private-key.pem') ? await NestFactory.create(AppModule) : await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const host = configService.get('APP_HOST');
  const port = configService.get('APP_PORT');
  const appEnvironment = configService.get('APP_ENVIRONMENT');

  app.useGlobalFilters(
    new BadRequestExceptionFilter(),
    new ForbiddenExceptionFilter(),
    new InternalServerErrorExceptionFilter(),
    new NotFoundExceptionFilter(),
    new UnauthorizeExceptionFilter(),
  );

  app.enableCors();

  app.listen(process.env.PORT ?? "3000", '0.0.0.0', () => {
    console.log("Server is running.");
  });
}
bootstrap();
