/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CanActivate, ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { typeId } from '../Users/Interfaces/param-id';
import { UsersService } from '../Users/users.service';
import { TestUrl } from './testUrl';
import { SupportRequestService } from 'src/SupportRequest/support-request/support-request.service';

@Injectable()
export class SupportRequestGuard implements CanActivate {
  constructor(
    private readonly userSrv: UsersService,
    private readonly supReqSrv: SupportRequestService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const reqUrl: string = request.originalUrl;
    if (TestUrl(reqUrl)) {
      const sessId: string = request.session.userId;
      const ticketId: string = request.params.id;
      const ticket = await this.supReqSrv.findById(ticketId);
      const userForRole = await this.userSrv.findById(sessId as typeId);
      const userRole = userForRole?.role;
      if (ticket?.user != sessId && userRole != 'manager')
        throw new HttpException(
          'Пользователь может работать с сообщениями только в своих запросах.',
          403,
        );
      const result =
        reqUrl.split('/')[2] === 'common' &&
        (userRole === 'client' || userRole === 'manager')
          ? true
          : 0;
      if (result != 0) {
        console.log('SRGuard - Роль подходит ');
        if (!result)
          throw new HttpException('Роль пользователя не подходит.(SRGuard)', 403);
      }
    }
    return true;
  }
}
