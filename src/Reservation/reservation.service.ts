/* eslint-disable no-useless-catch */
import { HttpException, Injectable } from '@nestjs/common';
import { Reservation, ReservationDocument } from './schemas/reservation.schema';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, ObjectId, Types } from 'mongoose';
import { outReservation } from './Interfaces/OutReservation';
import moment from 'moment';
import 'moment/locale/ru';
import { HotelService } from 'src/Hotels/hotel/hotel.service';
import { HotelRoomService } from 'src/Hotels/hotelRoom/hotel-room.service';
import { HotelRoom } from 'src/Hotels/Schemas/hotel.room.schema';
import { Hotel } from 'src/Hotels/Schemas/hotel.schema';
import { typeId } from 'src/Users/Interfaces/param-id';
import { ReservationDto } from './Interfaces/dto/ReservationDto';
import { IReservation } from './Interfaces/IReservation';
import { ReservationSearchOptions } from './Interfaces/ReservationSearchOptions';
import { ReservationFilters } from './Interfaces/ReservationFilters';

@Injectable()
export class ReservationService implements IReservation {
  newReserv: outReservation | null;
  constructor(
    @InjectModel(Reservation.name)
    private reservationModel: Model<ReservationDocument>,
    @InjectConnection() private connection: Connection,
    @InjectModel(Hotel.name) private readonly hotelService: HotelService,
    @InjectModel(HotelRoom.name) private readonly HRService: HotelRoomService,
  ) {
    this.newReserv = null;
  }
  /*Метод проверен*/
  async addReservation(data: ReservationDto): Promise<outReservation | string> {
    if (!(await this.HRService.findById(data.roomId as unknown as Types.ObjectId))) {
      throw new HttpException('Номера с указанным ID не существует', 400);
    }
    try {
      const occupied = await this.getReserveByRooms(data.roomId);
      if (
        occupied?.length === 0 ||
        occupied?.every(
          (item) =>
            moment(item.dateEnd).isBefore(data.dateStart) || // true, если item.dateEnd строго раньше data.dateSrart.
            (moment(item.dateStart).isAfter(data.dateEnd) &&
              moment(item.dateEnd).isAfter(data.dateStart)),
        )
      ) {
        const newReservation = new this.reservationModel(data);
        await newReservation.save();
        const output = await this.dataOutput(newReservation._id);
        return output;
      } else {
        throw new HttpException('Номер с указанным ID уже занят на указанную дату.', 404);
      }
    } catch (err) {
      throw err;
    }
  }
  /*Метод проверен*/
  async removeReservation(id: typeId): Promise<void> {
    const deleted = await this.reservationModel.findByIdAndDelete(id);
    if (!deleted) {
      throw new HttpException('Бронирования с таким id не существует', 400);
    }
  }
  /*Метод проверен*/
  async getReservations(
    params: ReservationSearchOptions,
  ): Promise<outReservation[] | string> {
    const outReserve: outReservation[] = [];
    const filter: ReservationFilters = {};
    const { userId, dateStart, dateEnd } = params;
    if (userId) filter.userId = { $eq: userId as string };
    if (dateStart) filter.dateStart = { $eq: dateStart };
    if (dateEnd) filter.dateEnd = { $eq: dateEnd };
    if (Object.keys(filter).length === 0) {
      throw new HttpException('Необходимо указать хотя бы один параметр для поиска', 400);
    }
    const reserves = await this.reservationModel
      .find<ReservationDocument>(filter)
      .select('-__v')
      .exec();
    for (const i of reserves) {
      const output = await this.dataOutput(i._id);
      outReserve.push(output as outReservation);
    }
    return outReserve;
  }
  /*Метод проверен*/
  async getReserveByRooms(id: ObjectId): Promise<Reservation[] | null> {
    return await this.reservationModel.find({ roomId: id }).select('-__v').exec();
  }
  /*Метод проверен*/
  async dataOutput(id: Types.ObjectId): Promise<outReservation | string> {
    try {
      const outData = await this.getRserveById(id);
      const DSString = moment(outData.dateStart).format('D MMMM YYYY');
      const DEString = moment(outData.dateEnd).format('D MMMM YYYY');
      const hotelObj = await this.hotelService.findById(outData.hotelId);
      const room = await this.HRService.findById(outData.roomId);
      if (!hotelObj || !room) {
        throw new HttpException(
          'Гостиница или номер не найдены. Либо указанный номер отключен',
          400,
        );
      }
      this.newReserv = {
        startDate: DSString,
        endDate: DEString,
        hotel: { title: hotelObj.title, description: hotelObj.description },
        hotelRoom: { description: room.description, images: room.images },
      };
      return this.newReserv;
    } catch (err) {
      throw err;
    }
  }

  async getRserveById(resId: Types.ObjectId): Promise<ReservationDocument> {
    const reserve = await this.reservationModel.findById(resId).select('-__v');
    if (!reserve) throw new HttpException('Бронирование с таким id не найдено', 404);
    return reserve;
  }
}
