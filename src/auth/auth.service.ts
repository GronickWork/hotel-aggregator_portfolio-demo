/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable no-useless-catch */
import { HttpException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { User, UserDocument } from '../Users/schemas/user.schema';
import { UsersService } from '../Users/users.service';
import * as bcrypt from 'bcrypt';
import { RegistrAuthDto } from './dto/registr.auth.dto';

@Injectable()
export class AuthService {
  newUser: any | null;
  constructor(
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    @InjectConnection() private connection: Connection,
    private readonly UserSRV: UsersService,
  ) {
    this.newUser = null;
  }

  async register(req: Request, data: RegistrAuthDto): Promise<UserDocument | null> {
    const existUser = await this.UserSRV.findByEmail(data.email);
    if (existUser) {
      throw new HttpException('Email уже занят.', 400);
    }
    const hashPassword = await bcrypt.hash(data.password, 10);
    const newData = { ...data, passwordHash: hashPassword };
    this.newUser = new this.UserModel(newData);
    try {
      await this.newUser.save();
      const findUser = await this.UserModel.findById({ _id: this.newUser.id })
        .select('_id email name')
        .exec();
      return findUser;
    } catch (err) {
      throw err;
    }
  }

  async login(data: User): Promise<object | null> {
    if (data) {
      const user = await this.UserSRV.findByEmail(data.email);
      return { email: user?.email, name: user?.name, contactPhone: user?.contactPhone };
    }
    return null;
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
}
