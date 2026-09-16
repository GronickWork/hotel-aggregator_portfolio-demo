import * as dotenv from 'dotenv';
dotenv.config();
import 'tsconfig-paths/register';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { links } from '../project-config/links-config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useWebSocketAdapter(new IoAdapter(app));
  app.enableCors();
  app.useStaticAssets(join(__dirname, '..', 'public'));
  /**Строки с useGlobalPipes по  SwaggerModule.setup нужны толко для Swagger*/
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors) => {
        const messages = errors.map((err) => {
          return {
            property: err.property,
            constraints: err.constraints,
          };
        });
        return new BadRequestException({
          message: 'Ошибка валидации',
          details: messages,
        });
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('API Агрегатора гостиниц')
    .setDescription('Бэкенд агрегатора: бронирование, отели, поддержка, авторизация')
    .setVersion('1.0.0')
    .addTag('hotels', 'Управление отелями и номерами')
    .addTag('reservations', 'Бронирование и заказы')
    .addTag('auth', 'Авторизация и токены')
    .addTag('users', 'Управление пользователями')
    .addTag('support-request', 'Чат с техподдрежкой')
    //.addBearerAuth(undefined, 'bearer') так swagger не видит токенов, по этому см след строка
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Введите JWT-токен (без префикса Bearer)',
        in: 'header',
      },
      'bearer', // это имя-ключ, которое потом используется в @ApiBearerAuth('bearer')
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(links.Port ?? 3000, () => {
    console.log(`Server starting - on PORT: ${links.Port}`);
  });
}
void bootstrap();
