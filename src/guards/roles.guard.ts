/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const ROLES_KEY = 'roles';

@Injectable()
export class RolesGuard {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Получаем требуемые роли из декоратора @Roles(...)
    const requiredRoles = this.reflector.getAllAndOverride<string[] | undefined>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    // Если ролей не задано — разрешаем (любой авторизованный ок)
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    // Если пользователя нет (например, забыли повесить AuthJwtGuard) — отклоняем
    if (!user) {
      throw new UnauthorizedException();
    }
    // Проверяем, есть ли роль пользователя среди требуемых
    return requiredRoles.some((role) => user.role === role);
  }
}
