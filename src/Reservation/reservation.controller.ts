/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Body,
  Controller,
  Delete,
  Get,
  //HttpException,
  Param,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import type { typeId } from '../Users/Interfaces/param-id';
import type { ReservationDto } from './dto/ReservationDto';
import { CreateReserveInterceptor } from './interceptors/createReserveInterceptor';
//import type { ReservationSearchOptions } from './Interfaces/ReservationSearchOptions';
import { IdReservationGuard } from '../guards/id-reservation.guard';
//import moment from 'moment';
import { Roles } from '@app/guards/decorators/role.decorator';
//import { AuthGuard } from '@nestjs/passport';
//import { RolesGuard } from '@app/guards/roles.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { ClientReserveDto } from './dto/ClientReserveDto';
import { AuthJwtGuard } from '@app/guards/auth.jwt.guard';
import { RolesGuard } from '@app/guards/roles.guard';
import { ReservationQueryDto } from './dto/reservation-query.dto';

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
  @ApiResponse({ status: 201, description: 'Номер успешно забронирован' })
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

  @Roles('client')
  @ApiBearerAuth('bearer')
  @ApiSecurity('bearer')
  @ApiOperation({
    summary:
      'Список броней текущего пользователя (только для пользователей с ролью client)',
  })
  @ApiResponse({ status: 201, description: 'Номера успешно получены' })
  @ApiResponse({ status: 401, description: 'Пользователь не авторизован' })
  @ApiResponse({ status: 403, description: 'Роль пользователя не client' })
  @Get('/client/reservations')
  getReservationsByClient(@Req() req) {
    const userId = req.user.userId; // Сюда userId приходит из JWT‑стратегии + Passport.
    if (!userId) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }
    return this.RrnService.getReservations({ userId });
  }

  @Roles('manager')
  @ApiBearerAuth('bearer')
  @ApiSecurity('bearer')
  @ApiOperation({
    summary:
      'Список броней конкретного пользователя (только для пользователей с ролью manager)',
  })
  @ApiResponse({ status: 201, description: 'Номера успешно получены' })
  @ApiResponse({ status: 401, description: 'Пользователь не авторизован' })
  @ApiResponse({ status: 403, description: 'Роль пользователя не manager' })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    description: 'ID конкретного пользователя',
  })
  @Get('/manager/reservations/:id') //Метод проверен
  getReservations(@Param('id') id: string, @Query() dto: ReservationQueryDto) {
    const filters = {
      userId: id as typeId,
      dateStart: dto.dateStart,
      dateEnd: dto.dateEnd,
    };
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
