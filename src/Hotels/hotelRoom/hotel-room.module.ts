import { Module } from '@nestjs/common';
import { HotelRoomService } from './hotel-room.service';
import { HotelRoomController } from './hotel-room.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { HotelRoom, HotelRoomSchema } from '../Schemas/hotel.room.schema';
import { HotelModule } from '../hotel/hotel.module';
import { UsersModule } from '../../Users/users.module';
import { HandlerFilesModule } from '@app/handler-files/handler-files.module';
import { HandlerFilesService } from '@app/handler-files/handler-files.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: HotelRoom.name, schema: HotelRoomSchema }]),
    HotelModule,
    UsersModule,
    HandlerFilesModule,
  ],
  controllers: [HotelRoomController],
  providers: [HotelRoomService, HandlerFilesService],
  exports: [MongooseModule, HotelRoomService],
})
export class HotelRoomModule {}
