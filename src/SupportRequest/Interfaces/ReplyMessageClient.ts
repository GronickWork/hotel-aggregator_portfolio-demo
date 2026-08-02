import { typeId } from '../../Users/Interfaces/param-id';

export interface ReplyMessageClient {
  id: typeId;
  createdAt: string;
  isActive: boolean;
  hasNewMessages: boolean;
}
