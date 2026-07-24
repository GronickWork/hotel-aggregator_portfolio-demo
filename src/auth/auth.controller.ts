/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User, UserDocument } from '../Users/schemas/user.schema';
import type { RegistrAuthDto } from './dto/registr.auth.dto';
import { AuthUserGuard } from '../guards/auth.guard';

@Controller('/api')
export class AuthController {
  constructor(private readonly authSrv: AuthService) {}

  @Post('/client/register')
  registerUser(
    @Request() req: Request,
    @Body() data: RegistrAuthDto,
  ): Promise<UserDocument | null> {
    return this.authSrv.register(req, data);
  }

  @Post('/auth/login')
  @UseGuards(AuthUserGuard)
  loginUser(@Body() data: User): object | null {
    return this.authSrv.login(data);
  }

  @Post('/auth/logout')
  async LogoutUser(@Request() req): Promise<void> {
    await req.session.destroy();
  }
}
