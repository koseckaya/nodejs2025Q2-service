import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as yaml from 'js-yaml';
import * as swaggerUi from 'swagger-ui-express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

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
