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
import { createRoomDto } from '../dto/createRoomDto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { updateRoomDto } from '../dto/updateRoomDto';
import { SearchRoomsParams } from '../dto/SearchRoomsParams';
import { Types } from 'mongoose';
import {
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiTags,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { AuthJwtGuard } from '@app/guards/auth.jwt.guard';
import { RolesGuard } from '@app/guards/roles.guard';
import { FilesRoomInterceptor } from '../interceptors/files-room-interceptors';
import { Roles } from '@app/guards/decorators/role.decorator';
import { Public } from '@app/guards/decorators/public.decorator';

@Controller('api')
@ApiBearerAuth('bearer')
@UseGuards(AuthJwtGuard, RolesGuard)
@ApiTags('hotels')
export class HotelRoomController {
  constructor(private readonly hotelRSV: HotelRoomService) {}

  @Public()
  @ApiOperation({
    summary: 'Основной API для поиска номеров. Доступно всем пользователям',
  })
  @ApiResponse({ status: 200, description: 'Номера отелей успешно получены.' })
  @Get('common/hotel-rooms') // Метод проверен
  getAllHotelRooms(@Query() query: SearchRoomsParams) {
    return this.hotelRSV.search(query);
  }

  @Public()
  @ApiOperation({
    summary: 'Получение подробной информации о номере.. Доступно всем пользователям',
  })
  @ApiParam({ name: 'id', required: true, type: String, description: 'ID номера отеля' })
  @ApiResponse({
    status: 200,
    description: 'Номера конкретного отеля успешно получены..',
  })
  @Get('common/hotel-rooms/:id') // Метод проверен
  getHotelRoom(@Param('id') id: Types.ObjectId) {
    return this.hotelRSV.findById(id);
  }

  @Roles('admin')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Добавление нового номера отеля (только для админа)' })
  @ApiResponse({ status: 201, description: 'Номер успешно создан' })
  @ApiResponse({ status: 401, description: 'Пользователь не авторизован' })
  @ApiResponse({ status: 403, description: 'Недостатчно прав доступа' })
  @UseInterceptors(FilesInterceptor('images', 10), FilesRoomInterceptor)
  @ApiBody({
    description: 'hotel, description — form-data; images — файлы (form-data, несколько)',
    schema: {
      type: 'object',
      properties: {
        hotel: { type: 'string', example: '69a19bff016224f814e81b7f' },
        description: { type: 'string', example: 'Двухместный номер на двоих' },
        images: {
          type: 'array',
          items: { type: 'file' }, // <-- это даёт кнопку загрузки в Swagger
          description: 'Файлы изображений (несколько)',
        },
      },
      required: ['hotel', 'description'],
    },
  })
  @Post('admin/hotel-rooms') // Метод проверен
  createHotelRoom(@Body() dto: createRoomDto) {
    return this.hotelRSV.create(dto);
  }

  @Roles('admin')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Изменение номера отеля (только для админа)' })
  @ApiResponse({ status: 201, description: 'Номер успешно изменен' })
  @ApiResponse({ status: 401, description: 'Пользователь не авторизован' })
  @ApiResponse({ status: 403, description: 'Недостатчно прав доступа' })
  @UseInterceptors(FilesInterceptor('images', 10), FilesRoomInterceptor)
  @ApiBody({
    description: 'description — form-data; images — файлы (form-data, несколько)',
    schema: {
      type: 'object',
      properties: {
        description: { type: 'string', example: 'Двухместный номер на двоих' },
        images: {
          type: 'array',
          items: { type: 'file' }, // <-- это даёт кнопку загрузки в Swagger
          description: 'Файлы изображений (несколько)',
        },
      },
    },
  })
  @Put('admin/hotel-rooms/:id') // Метод проверен
  updateHotelRoom(@Param('id') id: string, @Body() dto: updateRoomDto) {
    return this.hotelRSV.update(id, dto);
  }
}
