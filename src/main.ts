import 'tsconfig-paths/register';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { keys } from '../project-config/keys-config';
import { links } from '../project-config/links-config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
    .addTag('auth', 'Авторизация и сессии')
    .addTag('support', 'Заявки в поддержку')
    .addBearerAuth(undefined, 'bearer')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.use(cookieParser());
  app.use(
    session({
      secret: keys.SeSSSct || 'notSecret',
      resave: false,
      saveUninitialized: false,
      cookie: { secure: process.env.NODE_ENV === 'production' },
    }),
  );
  await app.listen(links.Port ?? 3000, () => {
    console.log(`Server starting - on PORT: ${links.Port}`);
  });
}
void bootstrap();
