import { typeId } from '../../Users/Interfaces/param-id';

export interface SendMessageDto {
  author: typeId;
  supportRequest: typeId | string;
  text: string;
}
