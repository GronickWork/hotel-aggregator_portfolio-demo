import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  //Query,
  UseGuards,
} from '@nestjs/common';
import { HotelService } from './hotel.service';
import { createHotelDto } from '../dto/createHotelDto';
import { HotelDocument } from '../Schemas/hotel.schema';
import { UpdateHotelParams } from '../Interfaces/UpdateHotelParams';
import type { typeId } from '../../Users/Interfaces/param-id';
//import type { SearchHotelParams } from '../Interfaces/SearchHotelParams';
import { Roles } from '@app/guards/decorators/role.decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { AuthJwtGuard } from '@app/guards/auth.jwt.guard';
import { RolesGuard } from '@app/guards/roles.guard';

@Controller('api')
@ApiTags('hotels')
@ApiSecurity('bearer')
@UseGuards(AuthJwtGuard, RolesGuard)
@ApiBearerAuth('bearer')
export class HotelController {
  constructor(private readonly hotelHSV: HotelService) {}

  @Post('admin/hotels/') // Метод проверен
  @Roles('admin')
  @ApiOperation({ summary: 'Добавление нового отеля (только для админа)' })
  @ApiResponse({ status: 201, description: 'Отель успешно создан' })
  @ApiResponse({ status: 401, description: 'Пользователь не авторизован' })
  @ApiResponse({ status: 403, description: 'Недостатчно прав доступа' })
  @ApiBody({ type: createHotelDto })
  create(@Body() body: createHotelDto): Promise<Partial<HotelDocument> | null> {
    return this.hotelHSV.create(body);
  }

  @Get('admin/hotels/') // Метод проверен
  @Roles('admin')
  @ApiOperation({
    summary: 'Получение списка гостиниц администратором. (только для админа)',
  })
  @ApiResponse({ status: 200, description: 'Список успешно получен' })
  @ApiResponse({ status: 401, description: 'Пользователь не авторизован' })
  @ApiResponse({ status: 403, description: 'Недостатчно прав доступа' })
  getHotelsList(): Promise<Partial<HotelDocument>[]> {
    return this.hotelHSV.getHotelsList();
  }

  @Put('admin/hotels/:id') // Метод проверен
  @Roles('admin')
  @ApiOperation({
    summary: 'Изменение описания гостиницы администратором. (только для админа)',
  })
  @ApiParam({ name: 'id', required: true, type: String, description: 'ID отеля' })
  @ApiResponse({ status: 200, description: 'Описание успешно изменено.' })
  @ApiResponse({ status: 401, description: 'Пользователь не авторизован' })
  @ApiResponse({ status: 403, description: 'Недостатчно прав доступа' })
  @ApiBody({ type: UpdateHotelParams })
  updateHotel(
    @Param('id') id: typeId,
    @Body() body: UpdateHotelParams,
  ): Promise<Partial<HotelDocument> | null> {
    console.log(' from HotelController.updateHotel id: ', id);
    return this.hotelHSV.update(id, body);
  }
}
