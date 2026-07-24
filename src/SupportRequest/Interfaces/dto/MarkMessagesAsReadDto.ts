import { typeId } from 'src/Users/Interfaces/param-id';

export interface MarkMessagesAsReadDto {
  user: typeId;
  supportRequest: typeId;
  createdBefore: Date;
}
