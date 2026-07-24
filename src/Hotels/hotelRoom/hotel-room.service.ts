/* eslint-disable @typescript-eslint/no-base-to-string */
/* eslint-disable no-useless-catch */
import { HttpException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { HotelRoom, HotelRoomDocument } from '../Schemas/hotel.room.schema';
import { Connection, Model, Types } from 'mongoose';
import { createRoomDto } from '../Interfaces/dto/createRoomDto';
import { ShowRoomData } from '../Interfaces/ShowRoomData';
import { HotelService } from '../hotel/hotel.service';
import { updateRoomDto } from '../Interfaces/dto/updateRoomDto';
import { SearchRoomsParams } from '../Interfaces/SearchRoomsParams';
import { typeId } from 'src/Users/Interfaces/param-id';

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
    if (data.hotel) {
      const findRooms = await this.HotelRoom.find({
        hotel: { $regex: String(data.hotel), $options: 'i' },
        isEnabled: true,
      })
        .select('-__v')
        .exec();
      return findRooms.length > 0
        ? findRooms.slice(data.offset, data.offset + data.limit)
        : 'Номера с такими параметрами не найдены.';
    }
  }
  /**Метод проверен */
  async update(
    id: Types.ObjectId,
    data: updateRoomDto,
  ): Promise<Partial<ShowRoomData> | null | string> {
    data.updatedAt = new Date();
    const updatedRoom = await this.HotelRoom.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (updatedRoom) {
      return this.findById(id);
    } else {
      return null;
    }
  }
}
