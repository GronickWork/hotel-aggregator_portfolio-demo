import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDocument } from './schemas/user.schema';
import { createUserDto } from './Interfaces/dto/createUserDto';
import { SearchUserParams } from './Interfaces/SearchUserParams';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthJwtGuard } from '../guards/auth.jwt.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../guards/decorators/role.decorator';

@Controller('api')
@ApiTags('users')
@ApiBearerAuth('bearer')
@UseGuards(AuthJwtGuard, RolesGuard)
export class UsersController {
  constructor(private readonly userSRV: UsersService) {}

  @Post('admin/users/') //Метод проверен
  @Roles('admin')
  @ApiOperation({ summary: 'Регистрация нового пользователя (только для админа)' })
  @ApiResponse({ status: 201, description: 'Пользователь успешно создан' })
  @ApiResponse({ status: 400, description: 'Ошибка валидации или дубликат email' })
  @ApiResponse({ status: 403, description: 'Недостатчно прав доступа' })
  @ApiBody({ type: createUserDto })
  create(@Body() body: createUserDto): Promise<Partial<UserDocument> | null> {
    return this.userSRV.create(body);
  }

  @Get('admin/users/') //Метод проверен
  @Roles('admin')
  @ApiOperation({ summary: 'Получение списка пользователей (только для админа)' })
  @ApiResponse({ status: 200, description: 'Список успешно получен' })
  @ApiResponse({ status: 403, description: 'Недостатчно прав доступа' })
  findAllForAdmin(@Query() params: SearchUserParams, @Req() req: Request) {
    const user = req as unknown as { user: { role: string } };
    const { role } = user.user;
    return this.userSRV.findAll(params, role);
  }

  @Get('manager/users/') //Метод проверен
  @Roles('manager')
  @ApiOperation({ summary: 'Получение списка пользователей (только для Менеджера)' })
  @ApiResponse({ status: 200, description: 'Список успешно получен' })
  @ApiResponse({ status: 403, description: 'Недостатчно прав доступа' })
  findAllforManager(@Query() params: SearchUserParams, @Req() req: Request) {
    const user = req as unknown as { user: { role: string } };
    const { role } = user.user;
    return this.userSRV.findAll(params, role);
  }
}
