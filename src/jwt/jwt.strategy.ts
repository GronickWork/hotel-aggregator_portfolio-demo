/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UsersService } from 'src/Users/users.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { typeId } from 'src/Users/Interfaces/param-id';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private ursS: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'fallback-secret-change-in-prod',
    });
  }

  // sub в JWT — это всегда строка. Не усложняй интерфейс
  async validate(payload: { sub: string }) {
    // Приводим к typeId прямо здесь, чтобы угодить UsersService
    const id: typeId = { id: payload.sub };
    const user = await this.ursS.findById(id);

    if (!user) {
      throw new HttpException(
        'Пользователь не найден или токен невалиден',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return {
      userId: user.id,
      email: user.email,
      name: user.name,
      contactPhone: user.contactPhone,
      role: user.role,
    };
  }
}
