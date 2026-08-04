import { Module } from '@nestjs/common';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Reservation, ReservationSchema } from './schemas/reservation.schema';
import { HotelModule } from '../Hotels/hotel/hotel.module';
import { HotelRoomModule } from '../Hotels/hotelRoom/hotel-room.module';
import { HotelRoomService } from '../Hotels/hotelRoom/hotel-room.service';
import { HotelService } from '../Hotels/hotel/hotel.service';
import { UsersModule } from '../Users/users.module';
import { AuthJwtGuard } from '../guards/auth.jwt.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Reservation.name,
        schema: ReservationSchema,
      },
    ]),
    HotelRoomModule,
    HotelModule,
    UsersModule,
  ],
  controllers: [ReservationController],
  providers: [ReservationService, HotelRoomService, HotelService, AuthJwtGuard],
})
export class ReservationModule {}
