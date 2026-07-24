import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { typeId } from 'src/Users/Interfaces/param-id';
import { Message } from './message.schema';
import { Types } from 'mongoose';

export type SupportRequestDocument = SupportRequest & Document;

@Schema()
export class SupportRequest {
  id: typeId;

  @Prop({ required: true, type: Types.ObjectId })
  user: typeId;

  @Prop({ required: true, default: Date.now() })
  createdAt: Date;

  @Prop({ type: Types.ObjectId, ref: Message.name })
  messages: typeId[];

  @Prop({ default: true })
  isActive: boolean;
}

export const SupportRequestSchema = SchemaFactory.createForClass(SupportRequest);
