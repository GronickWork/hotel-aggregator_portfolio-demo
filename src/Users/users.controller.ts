import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDocument } from './schemas/user.schema';
import type { createUserDto } from './Interfaces/dto/createUserDto';
import type { SearchUserParams } from './Interfaces/SearchUserParams';
import { AuthUserGuard } from '../guards/auth.guard';

@Controller('api')
export class UsersController {
  constructor(private readonly userSRV: UsersService) {}

  @Post('/admin/users/') //Метод проверен
  @UseGuards(AuthUserGuard)
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
