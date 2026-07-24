/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { UsersService } from '../Users/users.service';
import { AuthGuard } from '@nestjs/passport';
import { typeId } from 'src/Users/Interfaces/param-id';
import { TestUrl } from './testUrl';

@Injectable()
export class AuthUserGuard extends AuthGuard('local') {
  constructor(private readonly userSrv: UsersService) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const reqUrl: string = request.originalUrl;
    if (reqUrl === '/api/auth/login') {
      const validUser = (await super.canActivate(context)) as boolean;
      if (!validUser) return false;
      const validateUser = this.handleRequest(null, request.user);
      if (validateUser && request.session) {
        request.session.userId = validateUser.id;
      }
      return true;
    }
    if (!request.session.userId) {
      throw new HttpException('Пользователь не авторизован.', 401);
    }
    if (TestUrl(reqUrl)) return true; // Обработку этих urls перенес в SupportRequestGuard.

    const userForRole = await this.userSrv.findById(request.session.userId as typeId);
    const result = reqUrl.split('/')[2] === userForRole?.role ? true : 0;
    if (result != 0) {
      console.log('Роль подходит from authGuard');
    }
    if (result === 0)
      throw new HttpException('Роль пользователя не подходит.from authGuard', 403);
    return true;
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw err || new Error('Authentication failed');
    }
    return user;
  }
}

export { AuthGuard };
