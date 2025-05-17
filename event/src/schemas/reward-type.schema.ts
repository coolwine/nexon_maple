import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RewardTypeDocument = RewardType & Document;

@Schema({ timestamps: true })
export class RewardType {
  @Prop({ required: true, unique: true })
  type: string;

  @Prop()
  description?: string;

  @Prop()
  createdBy: string;
}

export const RewardTypeSchema = SchemaFactory.createForClass(RewardType);
