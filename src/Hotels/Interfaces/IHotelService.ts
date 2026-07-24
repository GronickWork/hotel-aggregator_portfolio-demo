import { ObjectId, Types } from 'mongoose';
import { typeId } from '../../Users/Interfaces/param-id';
import { Hotel, HotelDocument } from '../Schemas/hotel.schema';
import { SearchHotelParams } from './SearchHotelParams';
import { UpdateHotelParams } from './UpdateHotelParams';

export interface IHotelService {
  create(data: any): Promise<Partial<HotelDocument> | null>;
  findById(id: Types.ObjectId): Promise<Hotel | string>;
  search(params: SearchHotelParams): Promise<Hotel[] | string>;
  update(id: typeId, data: UpdateHotelParams): Promise<Hotel | string>;
}
