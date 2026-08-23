import { ObjectId } from 'mongoose';
//import { typeId } from 'src/Users/Interfaces/param-id';

export interface ReservationDto {
  userId: ObjectId;
  hotelId: ObjectId;
  roomId: ObjectId;
  dateStart: Date;
  dateEnd: Date;
}
