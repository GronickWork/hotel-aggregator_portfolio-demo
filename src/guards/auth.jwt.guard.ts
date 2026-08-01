/* eslint-disable @typescript-eslint/no-unsafe-return */
import { ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

// Ключ, по которому ищем метку @Public()
export const IS_PUBLIC_KEY = 'isPublic';

@Injectable()
export class AuthJwtGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // 1. Проверяем, помечен ли эндпоинт как публичный (@Public)
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true; // Пропускаем без проверки токена (логин, регистрация и т.п.)
    }
    // 2. Если не публичный — делегируем основную проверку родителю (Passport)
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw new HttpException(
        'JWT токен не валиден либо пользователь не авторизован',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return user;
  }
}
