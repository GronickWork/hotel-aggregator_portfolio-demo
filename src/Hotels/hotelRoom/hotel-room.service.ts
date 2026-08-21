/* eslint-disable @typescript-eslint/no-base-to-string */
/* eslint-disable no-useless-catch */
import { HttpException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { HotelRoom, HotelRoomDocument } from '../Schemas/hotel.room.schema';
import { Connection, Model, Types } from 'mongoose';
import { createRoomDto } from '../dto/createRoomDto';
import { ShowRoomData } from '../Interfaces/ShowRoomData';
import { HotelService } from '../hotel/hotel.service';
import { updateRoomDto } from '../dto/updateRoomDto';
import { SearchRoomsParams } from '../dto/SearchRoomsParams';
import { typeId } from '../../Users/Interfaces/param-id';

@Injectable()
export class HotelRoomService implements HotelRoomService {
  fields: string;
  constructor(
    @InjectModel(HotelRoom.name) private HotelRoom: Model<HotelRoomDocument>,
    @InjectConnection() private connection: Connection,
    private readonly HlServise: HotelService,
  ) {
    this.fields = 'id description images hotel isEnabled';
  }
  /**Метод проверен */
  async create(data: createRoomDto): Promise<Partial<ShowRoomData> | null> {
    const room = new this.HotelRoom(data);
    try {
      await room.save();
      return this.findById(room._id);
    } catch (err) {
      throw err;
    }
  }
  /**Метод проверен */
  async findById(id: Types.ObjectId): Promise<Partial<ShowRoomData> | null> {
    let outRoom: Partial<ShowRoomData> | null = null;
    try {
      const findRoom = await this.HotelRoom.findOne({ _id: id }).select(this.fields);
      if (findRoom && findRoom.isEnabled === true) {
        const findHotel = await this.HlServise.findById(findRoom.hotel);
        outRoom = {
          id: findRoom.id as typeId,
          description: findRoom.description,
          images: findRoom.images,
          hotel: {
            id: String(findHotel.id),
            title: findHotel.title,
            description: findHotel.description,
          },
        };
      } else {
        throw new HttpException(
          'Номера с указанным ID не существует или он отключён.',
          400,
        );
      }
      return outRoom;
    } catch (err) {
      throw err;
    }
  }
  /**Метод проверен */
  async search(data: SearchRoomsParams) {
    const limit = Number(data.limit ?? 10); // если нет — будет 10
    const offset = Number(data.offset ?? 0); // если нет — будет 0
    const query: { isEnabled: true; hotel?: string } = { isEnabled: true };
    if (data.hotel) {
      query.hotel = data.hotel;
    }
    const findRooms = await this.HotelRoom.find(query)
      .select('-__v')
      .skip(offset)
      .limit(limit)
      .exec();
    return findRooms;
  }
  /**Метод проверен */
  async update(
    id: string,
    data: updateRoomDto,
  ): Promise<Partial<ShowRoomData> | null | string> {
    data.updatedAt = new Date();
    const objectId = new Types.ObjectId(id);
    console.log('from HotelRoomService.update data:', data);
    /*const updatedRoom = await this.HotelRoom.findByIdAndUpdate(objectId, data, {
      new: true,
    });*/
    const updatedRoom = '';
    if (updatedRoom) {
      return await this.findById(objectId);
    } else {
      return null;
    }
  }
}
