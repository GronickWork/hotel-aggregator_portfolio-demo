import { typeId } from '../../../Users/Interfaces/param-id';

export interface createRoomDto {
  hotel: typeId;
  description: string;
  images: string[] | File[];
}
