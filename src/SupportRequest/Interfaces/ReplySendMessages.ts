import { typeId } from 'src/Users/Interfaces/param-id';

export interface ReplySendMessages {
  id: typeId | string;
  createdAt: string;
  text: string;
  readAt: string;
  author: {
    id: string | undefined;
    name: string | undefined;
  };
}
