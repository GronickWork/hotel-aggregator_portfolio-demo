import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { Types } from 'mongoose';

export type ReservationDocument = Reservation & Document;

@Schema()
export class Reservation {
  _id: Types.ObjectId;

  @Prop({ required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  hotelId: Types.ObjectId;

  @Prop({ required: true })
  roomId: Types.ObjectId;

  @Prop({ required: true, type: Date })
  dateStart: Date | string;

  @Prop({ required: true, type: Date })
  dateEnd: Date | string;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
