import { typeId } from '../../Users/Interfaces/param-id';

export interface CreateMessageDto {
  author: typeId;
  text: string;
}
