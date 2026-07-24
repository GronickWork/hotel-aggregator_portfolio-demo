import { Module } from '@nestjs/common';
import { MemoryStore } from 'express-session';
import { keys } from 'project-config/keys-config';

@Module({
  imports: [],
  providers: [
    {
      provide: 'SESSION_OPTIONS',
      useValue: {
        secret: keys.SeSSSct || 'secret-key',
        resave: false,
        saveUninitialized: false,
        store: new MemoryStore(),
        cookie: {
          maxAge: 3600000,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production' ? true : false,
        },
      },
    },
  ],
})
export class SessionModule {}
