/* eslint-disable no-useless-catch */
import { HttpException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Hotel, HotelDocument } from '../Schemas/hotel.schema';
import { Connection, Model, Types } from 'mongoose';
import { createHotelDto } from '../Interfaces/dto/createHotelDto';
import { IHotelService } from '../Interfaces/IHotelService';
import { typeId } from 'src/Users/Interfaces/param-id';
import { SearchHotelParams } from '../Interfaces/SearchHotelParams';
import { UpdateHotelParams } from '../Interfaces/UpdateHotelParams';

@Injectable()
export class HotelService implements IHotelService {
  constructor(
    @InjectModel(Hotel.name) private HotelModel: Model<HotelDocument>,
    @InjectConnection() private connection: Connection,
  ) {}
  /**Метод проверен */
  async create(data: createHotelDto): Promise<Partial<HotelDocument> | null> {
    const hotel = new this.HotelModel(data);
    try {
      await hotel.save();
      const findHotel = await this.HotelModel.findOne({ _id: hotel._id }).select(
        '_id title description',
      );
      return findHotel;
    } catch (err) {
      throw err;
    }
  }
  /**Метод проверен */
  async getHotelsList(): Promise<Partial<HotelDocument>[]> {
    return this.HotelModel.find().select('_id title description').exec();
  }
  /**Метод проверен */
  async findById(id: Types.ObjectId): Promise<Hotel> {
    // Использование <Hotel | string> - вызовет ошибки в дальнейшем типа "свойств этого метода не существует"!!!
    const findHotel = await this.HotelModel.findOne({ _id: id }).select(
      '_id title description',
    );
    if (findHotel) {
      return findHotel;
    } else {
      throw new HttpException('Нет гостиницы с таким id', 404);
    }
  }
  /**Метод проверен */
  async search(params: SearchHotelParams): Promise<Hotel[] | string> {
    let findHotels: Hotel[];
    if (params.title) {
      findHotels = await this.HotelModel.find({
        title: { $regex: params.title, $options: 'i' },
      }).select('-__v');
      return findHotels.length > 0
        ? findHotels.slice(params.offset, params.offset + params.limit)
        : 'Гостиницы с такими параметрами не найдены.';
    } else {
      return 'Поля поиска не заполнены.';
    }
  }
  /**Метод проверен */
  async update(id: typeId, data: UpdateHotelParams): Promise<Hotel | string> {
    data.updatedAt = Date.now();
    const findHotel = await this.HotelModel.findByIdAndUpdate(id.id, data, {
      // id.id - так как id приходит в виде объекта {id: 'значение'}, а нужно string!!
      new: true,
    })
      .select('_id title description')
      .exec();
    if (findHotel) {
      return findHotel;
    } else {
      return 'Обновление не выполнено. Нет гостиницы с таким id.';
    }
  }
}
