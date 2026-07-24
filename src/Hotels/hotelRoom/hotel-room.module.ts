import { Module } from '@nestjs/common';
import { HotelRoomService } from './hotel-room.service';
import { HotelRoomController } from './hotel-room.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { HotelRoom, HotelRoomSchema } from '../Schemas/hotel.room.schema';
import { HotelModule } from '../hotel/hotel.module';
import { UsersModule } from 'src/Users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: HotelRoom.name, schema: HotelRoomSchema }]),
    HotelModule,
    UsersModule,
  ],
  controllers: [HotelRoomController],
  providers: [HotelRoomService],
  exports: [MongooseModule, HotelRoomService],
})
export class HotelRoomModule {}
