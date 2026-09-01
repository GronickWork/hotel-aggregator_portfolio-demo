/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../Users/users.service';
import { SupportRequestService } from '../SupportRequest/support-request/support-request.service';

@Injectable()
export class SupportRequestGuard implements CanActivate {
  constructor(
    private readonly userSrv: UsersService,
    private readonly supReqSrv: SupportRequestService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const ticketId: string = request.params.id;
    const userId = request.user.userId; // request.user берём из JWT.
    const userRole = request.user.role; //role берём из JWT.

    if (!userId) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }

    const ticket = await this.supReqSrv.findById(ticketId);
    if (!ticket) {
      throw new NotFoundException(`Обращение с id ${ticketId} не найдено`);
    }

    // Проверка: либо это менеджер, либо это клиент, создавший обращение
    const isManager = userRole === 'manager';
    const isOwner = ticket.user === userId;
    if (isManager || isOwner) {
      return true;
    }
    throw new ForbiddenException(
      'Роль пользователя не подходит: только менеджер или владелец обращения может работать с сообщениями',
    );
  }
}
