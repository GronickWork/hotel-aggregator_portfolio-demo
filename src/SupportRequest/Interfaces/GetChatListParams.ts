import { typeId } from 'src/Users/Interfaces/param-id';

export interface GetChatListParams {
  user: typeId | null;
  isActive: boolean;
}
