/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User, UserDocument } from '../Users/schemas/user.schema';
import { RegistrAuthDto } from './dto/registr.auth.dto';
import { AuthUserGuard } from '../guards/auth.guard';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('/api')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authSrv: AuthService) {}

  @Post('/client/register')
  @ApiOperation({ summary: 'Регистрация нового пользователя (клиент)' })
  @ApiResponse({ status: 201, description: 'Пользователь успешно создан' })
  @ApiResponse({ status: 400, description: 'Ошибка валидации или дубликат email' })
  @ApiBody({ type: RegistrAuthDto })
  registerUser(
    @Request() req: Request,
    @Body() data: RegistrAuthDto,
  ): Promise<UserDocument | null> {
    return this.authSrv.register(req, data);
  }

  @Post('/auth/login')
  @UseGuards(AuthUserGuard)
  @ApiOperation({ summary: 'Авторизация пользователя (логин)' })
  @ApiResponse({ status: 200, description: 'Успешная авторизация' })
  @ApiResponse({ status: 401, description: 'Неверный email или пароль' })
  loginUser(@Body() data: User): object | null {
    return this.authSrv.login(data);
  }

  @Post('/auth/logout')
  @ApiOperation({ summary: 'Выход пользователя (разлогин)' })
  @ApiResponse({ status: 204, description: 'Сессия успешно уничтожена' })
  @ApiResponse({ status: 401, description: 'Пользователь не авторизован' })
  async LogoutUser(@Request() req): Promise<void> {
    await req.session.destroy();
  }
}
