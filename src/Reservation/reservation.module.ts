import { Module } from '@nestjs/common';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Reservation, ReservationSchema } from './schemas/reservation.schema';
import { HotelModule } from 'src/Hotels/hotel/hotel.module';
import { HotelRoomModule } from 'src/Hotels/hotelRoom/hotel-room.module';
import { HotelRoomService } from 'src/Hotels/hotelRoom/hotel-room.service';
import { HotelService } from 'src/Hotels/hotel/hotel.service';
import { UsersModule } from 'src/Users/users.module';
import { AuthUserGuard } from 'src/guards/auth.guard';

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
  providers: [ReservationService, HotelRoomService, HotelService, AuthUserGuard],
})
export class ReservationModule {}
