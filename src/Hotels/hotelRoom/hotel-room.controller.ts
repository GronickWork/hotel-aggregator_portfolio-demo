import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { HotelRoomService } from './hotel-room.service';
import type { createRoomDto } from '../Interfaces/dto/createRoomDto';
import { RoomFilesInterceptor } from '../interceptors/roomFilesInterseptor';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import type { updateRoomDto } from '../Interfaces/dto/updateRoomDto';
import type { SearchRoomsParams } from '../Interfaces/SearchRoomsParams';
import { Types } from 'mongoose';
import { AuthUserGuard } from 'src/guards/auth.guard';

@Controller('/api')
export class HotelRoomController {
  constructor(private readonly hotelRSV: HotelRoomService) {}

  @Get('/common/hotel-rooms') // Метод проверен
  getAllHotelRooms(@Query() body: SearchRoomsParams) {
    return this.hotelRSV.search(body);
  }

  @Get('/common/hotel-rooms/:id') // Метод проверен
  getHotelRoom(@Param('id') id: Types.ObjectId) {
    return this.hotelRSV.findById(id);
  }

  @Post('/admin/hotel-rooms') // Метод проверен
  @UseGuards(AuthUserGuard)
  @UseInterceptors(AnyFilesInterceptor(), RoomFilesInterceptor)
  createHotelRoom(@Body() body: createRoomDto) {
    return this.hotelRSV.create(body);
  }

  @Put('/admin/hotel-rooms/:id') // Метод проверен
  @UseGuards(AuthUserGuard)
  @UseInterceptors(AnyFilesInterceptor(), RoomFilesInterceptor)
  updateHotelRoom(@Param('id') id: Types.ObjectId, @Body() body: updateRoomDto) {
    return this.hotelRSV.update(id, body);
  }
}
