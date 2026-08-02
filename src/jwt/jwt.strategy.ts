import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UsersService } from '../Users/users.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { typeId } from '../Users/Interfaces/param-id';
import { keyj } from '../../project-config/keys-config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UsersService) {
    const secret = keyj.JwtSecret;
    if (!secret) {
      throw new Error('JWT_SECRET is required. Set it in your config.');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
    });
  }

  // sub в JWT — это всегда строка. Не усложняй интерфейс
  async validate(payload: { sub: string }) {
    // Приводим к typeId прямо здесь, чтобы угодить UsersService
    const id: typeId = { id: payload.sub };
    const user = await this.userService.findByIdSilent(id);

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
