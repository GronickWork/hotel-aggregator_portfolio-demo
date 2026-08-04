import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDocument } from './schemas/user.schema';
import { createUserDto } from './Interfaces/dto/createUserDto';
import { SearchUserParams } from './Interfaces/SearchUserParams';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { AuthJwtGuard } from '../guards/auth.jwt.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../guards/decorators/role.decorator';

@Controller('api')
@ApiTags('user')
@UseGuards(AuthJwtGuard, RolesGuard)
export class UsersController {
  constructor(private readonly userSRV: UsersService) {}

  @Post('/admin/users/') //Метод проверен
  @Roles('admin')
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Регистрация нового пользователя (только для админа)' })
  @ApiResponse({ status: 201, description: 'Пользователь успешно создан' })
  @ApiResponse({ status: 400, description: 'Ошибка валидации или дубликат email' })
  @ApiResponse({ status: 403, description: 'Нет прав администратора' })
  @ApiBody({ type: createUserDto })
  create(@Body() body: createUserDto): Promise<Partial<UserDocument> | null> {
    return this.userSRV.create(body);
  }

  @Get('/admin/users/') //Метод проверен
  @Roles('admin')
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Получение списка пользователей (только для админа)' })
  @ApiResponse({ status: 201, description: 'Список успешно получен' })
  @ApiResponse({ status: 403, description: 'Недостатчно прав доступа' })
  @ApiBody({ type: SearchUserParams })
  findAllForAdmin(@Query() params: SearchUserParams) {
    return this.userSRV.findAll(params);
  }

  @Get('/manager/users/') //Метод проверен
  @Roles('manager')
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Получение списка пользователей (только для Менеджера)' })
  @ApiResponse({ status: 201, description: 'Список успешно получен' })
  @ApiResponse({ status: 403, description: 'Недостатчно прав доступа' })
  @ApiBody({ type: SearchUserParams })
  findAllforManager(@Query() params: SearchUserParams) {
    return this.userSRV.findAll(params);
  }
}
