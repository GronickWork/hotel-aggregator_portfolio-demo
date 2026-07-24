import { typeId } from 'src/Users/Interfaces/param-id';

export interface ReplyMessageClient {
  id: typeId;
  createdAt: string;
  isActive: boolean;
  hasNewMessages: boolean;
}
