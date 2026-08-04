import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegistrAuthDto } from './dto/registr.auth.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginAuthDto } from './dto/login.auth.dto';
import { ResponceRegistrAuthDto } from './dto/responce.registr.auth.dto';
import { AuthJwtGuard } from '@app/guards/auth.jwt.guard';
import { QuestOnlyGuard } from '@app/guards/guest.only.guard';

@ApiBearerAuth() // говорит Swagger: «тут нужен Bearer-токен»
@Controller('/api')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authSrv: AuthService) {}

  @Post('/client/register')
  @UseGuards(QuestOnlyGuard)
  @ApiOperation({ summary: 'Регистрация нового пользователя (клиент)' })
  @ApiResponse({ status: 201, description: 'Пользователь успешно создан' })
  @ApiResponse({ status: 400, description: 'Ошибка валидации или дубликат email' })
  @ApiBody({ type: RegistrAuthDto })
  registerUser(
    @Request() req: Request,
    @Body() data: RegistrAuthDto,
  ): Promise<ResponceRegistrAuthDto | null> {
    return this.authSrv.register(req, data);
  }

  @Post('/auth/login')
  @UseGuards(QuestOnlyGuard)
  @ApiOperation({ summary: 'Авторизация пользователя (логин и получение токена.)' })
  @ApiResponse({ status: 200, description: 'Успешная авторизация' })
  @ApiResponse({ status: 401, description: 'Неверный email или пароль' })
  @ApiBody({ type: LoginAuthDto })
  loginUser(@Body() data: LoginAuthDto): object | null {
    return this.authSrv.login(data);
  }

  @Post('/auth/logout')
  @UseGuards(AuthJwtGuard)
  @ApiOperation({
    summary:
      'Выход пользователя (разлогин). Поскольку сервер убивать токен не умеет, "statusCode": 401 - нормально, не зависимо от сообщения',
  })
  @ApiResponse({
    status: 204,
    description: 'Logout initiated; token must be removed on the client side',
  })
  @ApiResponse({ status: 401, description: 'Пользователь не авторизован' })
  LogoutUser(): void {
    // Для JWT на сервере не нужно ничего уничтожать.
    // Клиент должен удалить токен (из localStorage, cookie и т.п.).
  }
}
