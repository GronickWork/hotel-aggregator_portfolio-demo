/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { HotelRoomService } from '../../Hotels/hotelRoom/hotel-room.service';
import { ReservationDto } from '../dto/ReservationDto';

@Injectable()
export class CreateReserveInterceptor implements NestInterceptor {
  newData: ReservationDto | null;
  constructor(private readonly HRService: HotelRoomService) {
    this.newData = null;
  }
  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest(); // Перехват тела запроса
    const data = request.body;
    if (!data) {
      throw new HttpException('From Interceptor Нет данных в теле запроса', 400);
    }
    const room = await this.HRService.findById(data.hotelRoom);
    if (!room) {
      throw new HttpException(
        'From Interceptor Номера с указанным ID не существует',
        400,
      );
    }
    const userId = request.user?.userId;
    request.body = {
      roomId: data.hotelRoom,
      userId,
      hotelId: room.hotel ? room.hotel.id : data.hotelId,
      dateStart: new Date(data.dateStart), // Преобразование строки в объект Date ISO 8601
      dateEnd: new Date(data.dateEnd),
    }; // Замена тела запроса
    return next.handle().pipe(map((data) => data));
  }
}
