import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as yaml from 'js-yaml';
import * as swaggerUi from 'swagger-ui-express';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './auth/auth.guard';
import { LoggingService } from './logger/logger.service';
import { AllExceptionsFilter } from './logger/logger.filter';
import { LoggingMiddleware } from './logger/logger.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const jwtService = app.get(JwtService);
  const reflector = app.get(Reflector);
  const loggerService = app.get(LoggingService);
  const adapterHost = app.get(HttpAdapterHost);

  app.useGlobalGuards(new JwtAuthGuard(jwtService, reflector));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalInterceptors(new LoggingMiddleware(loggerService));
  app.useGlobalFilters(new AllExceptionsFilter(adapterHost, loggerService));

  const filePath = path.join(__dirname, '../doc/api.yaml');
  const altFilePath = path.join(process.cwd(), 'doc/api.yaml');

  let file: string;
  try {
    file = await fs.readFile(filePath, 'utf8');
  } catch (error) {
    file = await fs.readFile(altFilePath, 'utf8');
  }

  const swaggerDocument = yaml.load(file);

  app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  await app.listen(process.env.PORT || 4000);
}
bootstrap();
