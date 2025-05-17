import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Event } from './event.schema';

export type RewardDocument = Reward & Document;

export enum RewardType {
  POINT = 'POINT',
  ITEM = 'ITEM',
  COUPON = 'COUPON',
}

@Schema({ timestamps: true })
export class Reward {
  @Prop({ type: Types.ObjectId, ref: Event.name, required: true })
  eventId: Types.ObjectId;

  @Prop({ required: true })
  type: RewardType;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  quantity: number;
}

export const RewardSchema = SchemaFactory.createForClass(Reward);
