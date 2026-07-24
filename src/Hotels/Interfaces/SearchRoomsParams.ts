import { typeId } from 'src/Users/Interfaces/param-id';

export interface SearchRoomsParams {
  limit: number;
  offset: number;
  hotel: typeId | string;
  isEnabled?: boolean | undefined;
}
