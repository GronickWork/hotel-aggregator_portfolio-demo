import { HttpException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { User, UserDocument } from '../Users/schemas/user.schema';
import { UsersService } from '../Users/users.service';
import * as bcrypt from 'bcrypt';
import { RegistrAuthDto } from './dto/registr.auth.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginAuthDto } from './dto/login.auth.dto';
import { ResponceAuthDto } from './dto/responce.auth.dto';
import { ResponceRegistrAuthDto } from './dto/responce.registr.auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    @InjectConnection() private connection: Connection,
    private readonly UserSRV: UsersService,
    private readonly jwtSrv: JwtService,
  ) {}

  async register(
    // Адаптирован под Jwt token и демонcтрацию
    req: Request,
    data: RegistrAuthDto,
  ): Promise<ResponceRegistrAuthDto | null> {
    const existUser = await this.UserSRV.findByEmail(data.email);
    if (existUser) {
      throw new HttpException('Email уже занят.', 400);
    }
    const hashPassword = await bcrypt.hash(data.password, 10);
    const newData = { ...data, passwordHash: hashPassword };
    const newUser = await this.UserModel.create(newData);
    const token = this.generateAccessToken(newUser.id.toString());
    return {
      id: newUser.id.toString(),
      email: newUser.email,
      name: newUser.name,
      token,
    };
  }

  async login(data: LoginAuthDto): Promise<ResponceAuthDto | null> {
    // Адаптирован под Jwt token и демонcтрацию
    if (!data || !data.email || !data.password) {
      throw new HttpException('Email и пароль обязательны', 400);
    }
    const user = await this.validateUser(data.email, data.password);
    const access_token = this.generateAccessToken(user.id.toString());
    return {
      email: user.email,
      name: user.name,
      contactPhone: user.contactPhone,
      token: access_token,
    };
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.UserModel.findOne({ email }).select('-__v');
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new HttpException(
        'Пользователя с указанным email не существует или пароль неверный. Validate',
        401,
      );
    }
    return user;
  }

  private generateAccessToken(userId: string): string {
    const payload = { sub: userId }; // sub — стандартный claim в JWT
    const token = this.jwtSrv.sign(payload);
    console.log('Generated token: ', token);
    return token;
  }
}
