/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CanActivate, ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { ReservationService } from '../Reservation/reservation.service';

@Injectable()
export class IdReservationGuard implements CanActivate {
  constructor(private readonly reserveSrv: ReservationService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.userId;
    const reserv = await this.reserveSrv.getRserveById(
      request.params.id as Types.ObjectId,
    );
    if (reserv.userId != userId)
      throw new HttpException(
        'Пользователь не может удалять бронь созданную другими.',
        403,
      );
    return true;
  }
}
