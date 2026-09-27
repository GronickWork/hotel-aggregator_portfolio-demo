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
import { WsException } from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { typeId } from '@app/Users/Interfaces/param-id';

@Injectable()
export class SupportRequestGuard implements CanActivate {
  constructor(
    private readonly userSrv: UsersService,
    private readonly supReqSrv: SupportRequestService,
    private readonly jwtService: JwtService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // ---------- WebSocket ----------
    if (context.getType() === 'ws') {
      const client = context.switchToWs().getClient();

      // Токен из query (как в test-ws.html)
      const token = client.handshake.query?.token;
      if (!token || typeof token != 'string') {
        throw new WsException('Токен не передан');
      }

      let payload: any;
      try {
        payload = this.jwtService.verify(token);
      } catch {
        throw new WsException('Невалидный токен');
      }

      const userId = payload.sub as typeId;
      if (!userId) {
        throw new WsException('Пользователь не авторизован');
      }

      const user = await this.userSrv.findById(userId);
      if (!user) {
        throw new WsException('Пользователь не найден');
      }
      const userRole = user.role;

      // ticketId берём из handshake.query
      // (передаётся при подключении: ?token=...&ticketId=...)
      const ticketId = client.handshake.query?.ticketId;
      if (!ticketId || typeof ticketId != 'string') {
        throw new WsException('ID обращения не передан');
      }

      const ticket = await this.supReqSrv.findById(ticketId);
      if (!ticket) {
        throw new WsException(`Обращение с id ${ticketId} не найдено`);
      }

      const isManager = userRole === 'manager';
      const isOwner = ticket.user === userId;

      if (isManager || isOwner) {
        // Сохраняем пользователя в client.data — пригодится в хендлере
        client.data.user = payload;
        return true;
      }

      throw new WsException(
        'Только менеджер или владелец обращения может работать с сообщениями',
      );
    }

    // ---------- HTTP (оригинальная логика, без изменений) ----------
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
