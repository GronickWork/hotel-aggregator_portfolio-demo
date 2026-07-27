/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UsersService } from 'src/Users/users.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { typeId } from 'src/Users/Interfaces/param-id';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private ursS: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'fallback-secret-change-in-prod',
    });
  }

  async validate(payload: { sub: typeId }) {
    const user = await this.ursS.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      userId: user.id,
      role: user.role,
    };
  }
}
