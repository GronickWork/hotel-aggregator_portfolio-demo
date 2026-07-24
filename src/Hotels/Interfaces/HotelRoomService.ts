import { HotelRoom } from '../../Hotels/Schemas/hotel.room.schema';
import { typeId } from '../../Users/Interfaces/param-id';
import { SearchRoomsParams } from './SearchRoomsParams';

export interface HotelRoomService {
  create(data: Partial<HotelRoom>): Promise<HotelRoom>;
  findById(id: typeId): Promise<HotelRoom>;
  search(params: SearchRoomsParams): Promise<HotelRoom[]>;
  update(id: typeId, data: Partial<HotelRoom>): Promise<HotelRoom>;
}
