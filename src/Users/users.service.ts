/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable no-useless-catch */
import { HttpException, Injectable } from '@nestjs/common';
import { typeId } from './Interfaces/param-id';
import { SearchUserParams } from './Interfaces/SearchUserParams';
import { User, UserDocument } from './schemas/user.schema';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, QueryFilter } from 'mongoose';
import { createUserDto } from './Interfaces/dto/createUserDto';
import { IUserService } from './Interfaces/IUserService';
import { generate } from 'generate-password';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService implements IUserService {
  fields: string;
  newUser: any | null;
  constructor(
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    @InjectConnection() private connection: Connection,
  ) {
    this.fields = '_id email name contactPhone role whoCreate';
  }
  /*Метод проверен */
  async create(data: createUserDto): Promise<UserDocument | null> {
    try {
      const userMail = await this.UserModel.findOne({ email: data.email });
      if (userMail) {
        throw new HttpException('Пользователь с таким email уже существует', 400);
      }
      /* Генерируем простой временный пароль клиента. Внимание!!! Пароль в data.password подменяется этим!!!*/
      const password = generate({
        length: 7,
        numbers: true,
        uppercase: true,
        lowercase: true,
        strict: true,
      });
      console.log(`Новый пароль для ${data.name}: ${password}`);
      const hashPass = await bcrypt.hash(password, 10);
      data.passwordHash = hashPass;
      data.whoCreate = 'admin';
      const newUser = new this.UserModel(data);
      await newUser.save();
      return await this.findByEmail(data.email);
    } catch (err) {
      throw err;
    }
  }

  async findById(id: typeId): Promise<UserDocument | null> {
    try {
      const findUser = await this.UserModel.findById(id).select(this.fields);
      if (!findUser) {
        throw new HttpException('Пользователь не найден', 404);
      }
      return findUser;
    } catch (err) {
      throw err;
    }
  }

  /*Для стратегии: просто поиск, без исключений. Возвращает null, если нет. Чтобы не подменять ошибку 401 на 404 */
  async findByIdSilent(id: typeId): Promise<UserDocument | null> {
    return await this.UserModel.findOne({ _id: id.id });
  }

  /*Метод проверен */
  async findByEmail(email: string): Promise<UserDocument | null> {
    const findUser = await this.UserModel.findOne({ email }).select(this.fields);
    if (findUser) {
      return findUser;
    } else {
      return null;
    }
  }
  /*Метод проверен */
  async findAll(params: SearchUserParams, Role: string): Promise<UserDocument[]> {
    const limit = params.limit ?? 10; // если нет — будет 10
    const offset = params.offset ?? 0; // если нет — будет 0
    // Итговый фильтр по ролям
    const finalFilter: Record<string, unknown> = {};
    if (Role === 'manager') {
      finalFilter.role = { $in: ['client'] };
    }
    // Для 'admin' оставляем finalFilter пустым — он видит всех
    // 2. Фильтры по полям (поиск)
    const name = params.name?.trim();
    const email = params.email?.trim();
    const contactPhone = params.contactPhone?.trim();

    const filters: any[] = [];
    if (name) filters.push({ name: { $regex: name, $options: 'i' } });
    if (email) filters.push({ email: { $regex: email, $options: 'i' } });
    if (contactPhone) filters.push({ contactPhone: { $regex: contactPhone } });

    // 3. Объединяем фильтры
    let query: QueryFilter<UserDocument>;
    if (filters.length > 0) {
      query = {
        $and: [finalFilter, { $or: filters }],
      };
    } else {
      query = finalFilter;
    }
    return await this.UserModel.find<UserDocument>(query)
      .limit(limit)
      .skip(offset)
      .select(this.fields)
      .exec();
  }
}
