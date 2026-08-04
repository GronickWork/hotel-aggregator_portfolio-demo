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
import { JwtAuthModule } from '@app/jwt/jwt.module';
import { QuestOnlyGuard } from '@app/guards/guest.only.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule.register({ defaultStrategy: 'local' }),
    UsersModule,
    JwtAuthModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService, LocalStrategy, JwtStrategy, QuestOnlyGuard],
  exports: [AuthService],
})
export class AuthModule {}
