import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class GuestOnlyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const headers = req.headers as unknown as Record<string, string | string[]>;
    let auth = headers.authorization;
    if (Array.isArray(auth)) {
      auth = auth[0] || '';
    } else if (typeof auth !== 'string') {
      auth = '';
    }
    console.log('GuestOnlyGuard: header received:', auth);
    // Если есть любой Bearer-токен — запрещаем
    if (auth.startsWith('Bearer ')) {
      console.log('GuestOnlyGuard: token present → block');
      throw new ForbiddenException(
        'Действие доступно только неавторизованным пользователям',
      );
    }

    console.log('GuestOnlyGuard: no token → allow');
    return true;
  }
}
