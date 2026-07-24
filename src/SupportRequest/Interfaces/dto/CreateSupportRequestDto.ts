import { typeId } from 'src/Users/Interfaces/param-id';

export interface CreateSupportRequestDto {
  user: typeId;
  text: string;
}
