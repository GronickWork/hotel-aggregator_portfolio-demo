import { typeId } from '../../Users/Interfaces/param-id';

export interface GetChatListParams {
  user: typeId | null;
  isActive: boolean;
}
