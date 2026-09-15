import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import type { typeId } from '../../Users/Interfaces/param-id';

export type MessageDocument = Message & Document;

@Schema()
export class Message {
  id!: typeId;

  @Prop({ required: true, type: Types.ObjectId })
  author!: typeId;

  @Prop({ required: true, default: Date.now() })
  sentAt?: Date;

  @Prop({ required: true })
  text!: string;

  @Prop({ type: Date, required: false })
  readAt?: Date | undefined;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
