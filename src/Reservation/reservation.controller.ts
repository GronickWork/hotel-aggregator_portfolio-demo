/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import type { typeId } from '../Users/Interfaces/param-id';
import type { ReservationDto } from './dto/ReservationDto';
import { CreateReserveInterceptor } from './interceptors/createReserveInterceptor';
import type { ReservationSearchOptions } from './Interfaces/ReservationSearchOptions';
import { IdReservationGuard } from '../guards/id-reservation.guard';
import moment from 'moment';
import { Roles } from '@app/guards/decorators/role.decorator';
//import { AuthGuard } from '@nestjs/passport';
//import { RolesGuard } from '@app/guards/roles.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { ClientReserveDto } from './dto/ClientReserveDto';
import { AuthJwtGuard } from '@app/guards/auth.jwt.guard';
import { RolesGuard } from '@app/guards/roles.guard';

@Controller('api')
@ApiTags('reservations')
@UseGuards(AuthJwtGuard, RolesGuard)
export class ReservationController {
  constructor(private readonly RrnService: ReservationService) {}

  @Roles('client')
  @ApiBearerAuth('bearer')
  @ApiSecurity('bearer')
  @ApiOperation({
    summary: 'Бронирование номера клиентом (только для пользователей с ролью client)',
  })
  @ApiResponse({ status: 201, description: 'Номер успешно Забронирован' })
  @ApiResponse({ status: 401, description: 'Пользователь не авторизован' })
  @ApiResponse({ status: 403, description: 'Роль пользователя не client' })
  @ApiResponse({
    status: 400,
    description: 'Номера с указанным ID не существует или он отключён.',
  })
  @ApiBody({ type: ClientReserveDto })
  @UseInterceptors(CreateReserveInterceptor)
  @Post('client/reservations') //Метод проверен
  reserve(@Body() data: ReservationDto) {
    return this.RrnService.addReservation(data);
  }

  @Get('/client/reservations')
  getReservationsByClient(@Req() req) {
    const sesionId = req.session?.userId;
    const filters: ReservationSearchOptions = { userId: sesionId as typeId };
    return this.RrnService.getReservations(filters);
  }

  @Get('/manager/reservations/:id') //Метод проверен
  getReservations(
    @Param('id') id: string,
    @Query('dateStart') dateStart?: string,
    @Query('dateEnd') dateEnd?: string,
  ) {
    const dateFormatRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
    if (dateStart && !dateFormatRegex.test(dateStart))
      throw new HttpException('Параметр dateStart должен быть в формате ГГГГ-ММ-ДД', 400);
    if (dateEnd && !dateFormatRegex.test(dateEnd))
      throw new HttpException('Параметр dateEnd должен быть в формате ГГГГ-ММ-ДД', 400);
    const filters: ReservationSearchOptions = { userId: id as typeId };
    if (dateStart) filters.dateStart = moment(dateStart).toDate();
    if (dateEnd) filters.dateStart = moment(dateEnd).toDate();
    return this.RrnService.getReservations(filters);
  }

  @Delete('/client/reservations/:id') // Метод проверен
  @UseGuards(IdReservationGuard)
  async removeByClient(@Param('id') id: typeId): Promise<void> {
    await this.RrnService.removeReservation(id);
  }

  @Delete('/manager/reservations/:id')
  async removeByManager(@Param('id') id: typeId): Promise<void> {
    await this.RrnService.removeReservation(id);
  }
}
