import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { keys } from 'project-config/keys-config';
import { links } from 'project-config/links-config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
