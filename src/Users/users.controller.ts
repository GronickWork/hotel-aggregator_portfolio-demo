import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDocument } from './schemas/user.schema';
import { createUserDto } from './Interfaces/dto/createUserDto';
import type { SearchUserParams } from './Interfaces/SearchUserParams';
import { AuthUserGuard } from '../guards/auth.guard';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

@Controller('api')
@ApiTags('user')
export class UsersController {
  constructor(private readonly userSRV: UsersService) {}

  @Post('/admin/users/') //Метод проверен
  @UseGuards(AuthUserGuard)
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
  @UseGuards(AuthUserGuard)
  findAllForAdmin(@Query() params: SearchUserParams) {
    return this.userSRV.findAll(params);
  }

  @Get('/manager/users/') //Метод проверен
  @UseGuards(AuthUserGuard)
  findAllforManager(@Query() params: SearchUserParams) {
    return this.userSRV.findAll(params);
  }
}
