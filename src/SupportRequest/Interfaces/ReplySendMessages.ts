import { typeId } from '../../Users/Interfaces/param-id';

export class ReplySendMessages {
  id!: typeId;
  createdAt!: string;
  text!: string;
  readAt?: string;
  author!: {
    id: string | undefined;
    name: string | undefined;
  };
}
