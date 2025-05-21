import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TransferDocument = Transfer & Document;

@Schema({ timestamps: true })
export class Transfer extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Account', required: true })
  fromAccount: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Account', required: true })
  toAccount: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop()
  note: string;

  @Prop({ required: true })
  date: Date;
}

export const TransferSchema = SchemaFactory.createForClass(Transfer);

