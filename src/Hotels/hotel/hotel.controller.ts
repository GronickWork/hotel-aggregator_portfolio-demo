import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { HotelService } from './hotel.service';
import type { createHotelDto } from '../Interfaces/dto/createHotelDto';
import { Hotel, HotelDocument } from '../Schemas/hotel.schema';
import type { UpdateHotelParams } from '../Interfaces/UpdateHotelParams';
import type { typeId } from 'src/Users/Interfaces/param-id';
import type { SearchHotelParams } from '../Interfaces/SearchHotelParams';
import { AuthUserGuard } from '../../guards/auth.guard';

@Controller('/api')
export class HotelController {
  constructor(private readonly hotelHSV: HotelService) {}

  @Post('/admin/hotels/') // Метод проверен
  @UseGuards(AuthUserGuard)
  create(@Body() body: createHotelDto): Promise<Partial<HotelDocument> | null> {
    return this.hotelHSV.create(body);
  }

  @Get('/admin/hotels/') // Метод проверен
  @UseGuards(AuthUserGuard)
  getHotelsList(): Promise<Partial<HotelDocument>[]> {
    return this.hotelHSV.getHotelsList();
  }

  @Get('/admin/hotels') // Метод проверен
  @UseGuards(AuthUserGuard)
  searchHotel(@Query() params: SearchHotelParams): Promise<Hotel[] | string> {
    return this.hotelHSV.search(params);
  }

  @Put('/admin/hotels/:id') // Метод проверен
  @UseGuards(AuthUserGuard)
  updateHotel(
    @Param() id: typeId,
    @Body() body: UpdateHotelParams,
  ): Promise<Partial<HotelDocument> | null> {
    return this.hotelHSV.update(id, body);
  }
}
