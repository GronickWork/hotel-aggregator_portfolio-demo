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
import { IdReservationGuard } from '../guards/id-reservation.guard';
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
import { ClientReserveDto } from './dto/ClientReserveDto';
import { AuthJwtGuard } from '@app/guards/auth.jwt.guard';
import { RolesGuard } from '@app/guards/roles.guard';
import { ReservationQueryDto } from './dto/reservation-query.dto';

@Controller('api')
@ApiTags('reservations')
@UseGuards(AuthJwtGuard, RolesGuard)
export class ReservationController {
  constructor(private readonly RrnService: ReservationService) {}

  // Создание бронирования клиентом.
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

  // Свои брони пользователя
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

  // Список броней пользователя для менеджера.
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

  // Отмена бронирования клиентом
  @Roles('client')
  @ApiBearerAuth('bearer')
  @ApiSecurity('bearer')
  @ApiOperation({
    summary: 'Отмена бронирования клиентом (только для пользователей с ролью client)',
  })
  @ApiResponse({ status: 200, description: 'Бронирование успешно удалено' })
  @ApiResponse({ status: 401, description: 'Пользователь не авторизован' })
  @ApiResponse({ status: 403, description: 'Роль пользователя не client' })
  @ApiResponse({
    status: 403,
    description: ' ID текущего пользователя не совпадает с ID пользователя в брони',
  })
  @ApiResponse({ status: 400, description: 'Брони с указанным ID не существует' })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    description: 'ID забронированого номера',
  })
  @UseGuards(IdReservationGuard)
  @Delete('/client/reservations/:id') // Метод проверен
  async removeByClient(@Param('id') id: typeId): Promise<void> {
    await this.RrnService.removeReservation(id);
  }

  // Отмена бронирования менеджером
  @Roles('manager')
  @ApiBearerAuth('bearer')
  @ApiSecurity('bearer')
  @ApiOperation({
    summary: 'Отмена бронирования менеджером (только для пользователей с ролью manager)',
  })
  @ApiResponse({ status: 200, description: 'Бронирование успешно удалено' })
  @ApiResponse({ status: 401, description: 'Пользователь не авторизован' })
  @ApiResponse({ status: 403, description: 'Роль пользователя не manager' })
  @ApiResponse({ status: 400, description: 'Брони с указанным ID не существует' })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    description: 'ID забронированого номера',
  })
  @Delete('/manager/reservations/:id')
  async removeByManager(@Param('id') id: typeId): Promise<void> {
    await this.RrnService.removeReservation(id);
  }
}
