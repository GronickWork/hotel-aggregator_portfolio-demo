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
import { createRoomDto } from '../Interfaces/dto/createRoomDto';
//import { RoomFilesInterceptor } from '../interceptors/roomFilesInterseptor';
import { FilesInterceptor } from '@nestjs/platform-express';
import { updateRoomDto } from '../Interfaces/dto/updateRoomDto';
import { SearchRoomsParams } from '../Interfaces/SearchRoomsParams';
import { Types } from 'mongoose';
import {
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiTags,
  ApiBearerAuth,
  ApiSecurity,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { AuthJwtGuard } from '@app/guards/auth.jwt.guard';
import { RolesGuard } from '@app/guards/roles.guard';
import { FilesRoomInterceptor } from '../interceptors/files-room-interceptors';
import { Roles } from '@app/guards/decorators/role.decorator';

@Controller('api')
@ApiTags('hotels')
export class HotelRoomController {
  constructor(private readonly hotelRSV: HotelRoomService) {}

  @Get('common/hotel-rooms') // Метод проверен
  @ApiOperation({
    summary: 'Основной API для поиска номеров. Доступно всем пользователям',
  })
  @ApiResponse({ status: 200, description: 'Номера отелей успешно получены.' })
  getAllHotelRooms(@Query() body: SearchRoomsParams) {
    return this.hotelRSV.search(body);
  }

  @Get('common/hotel-rooms/:id') // Метод проверен
  @ApiOperation({
    summary: 'Получение подробной информации о номере.. Доступно всем пользователям',
  })
  @ApiParam({ name: 'id', required: true, type: String, description: 'ID номера отеля' })
  @ApiResponse({
    status: 200,
    description: 'Номера конкретного отеля успешно получены..',
  })
  getHotelRoom(@Param('id') id: Types.ObjectId) {
    return this.hotelRSV.findById(id);
  }

  @Post('admin/hotel-rooms') // Метод проверен
  @Roles('admin')
  @UseGuards(AuthJwtGuard, RolesGuard)
  @ApiBearerAuth('bearer')
  @ApiSecurity('bearer')
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
  createHotelRoom(@Body() dto: createRoomDto) {
    return this.hotelRSV.create(dto);
  }

  @Put('admin/hotel-rooms/:id') // Метод проверен
  @Roles('admin')
  @UseGuards(AuthJwtGuard, RolesGuard)
  @ApiBearerAuth('bearer')
  @ApiSecurity('bearer')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Изменение номера отеля (только для админа)' })
  @ApiResponse({ status: 201, description: 'Номер успешно измене' })
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
  updateHotelRoom(@Param('id') id: string, @Body() body: updateRoomDto) {
    return this.hotelRSV.update(id, body);
  }
}
