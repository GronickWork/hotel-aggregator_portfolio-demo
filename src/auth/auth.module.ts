import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../Users/users.module';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../Users/schemas/user.schema';
import { UsersService } from '../Users/users.service';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from '../jwt/jwt.strategy';
import { AnonymousGuard } from '@app/guards/anonymous.guard';
import { JwtAuthModule } from '@app/jwt/jwt.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule.register({ defaultStrategy: 'local' }),
    UsersModule,
    JwtAuthModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService, LocalStrategy, JwtStrategy, AnonymousGuard],
  exports: [AuthService],
})
export class AuthModule {}
