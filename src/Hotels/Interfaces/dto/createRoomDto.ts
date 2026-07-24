import { typeId } from 'src/Users/Interfaces/param-id';

export interface createRoomDto {
  hotel: typeId;
  description: string;
  images: string[] | File[];
}
