import { typeId } from 'src/Users/Interfaces/param-id';

export interface CreateMessageDto {
  author: typeId;
  text: string;
}
