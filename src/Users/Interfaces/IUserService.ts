import { User, UserDocument } from '../schemas/user.schema';
import { typeId } from './param-id';
import { SearchUserParams } from './SearchUserParams';

export interface IUserService {
  create(data: Partial<User>): Promise<User | null>;
  findById(id: typeId): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(params: SearchUserParams): Promise<UserDocument[] | string>;
}
