import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Warning extends Document {
  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  importance: string;
}

export const WarningSchema = SchemaFactory.createForClass(Warning);
@Schema({ timestamps: true })
export class Cost extends Document {
  @Prop({ required: true })
  type: string;

  @Prop({ required: false })
  cost: string;
}
export const CostSchema = SchemaFactory.createForClass(Cost);
@Schema({ _id: false })
export class Car {
  @Prop({ required: true })
  brand: string;

  @Prop({ required: true })
  modelName: string;

  @Prop({ required: true })
  engineVolume: string;

  @Prop({ required: true })
  year: number;

  @Prop({ required: true })
  driveType: string;

  @Prop({ required: true })
  mileage: number;

  @Prop({ required: true })
  lastOilChange: number;

  @Prop({ required: true })
  fuelConsumption: number;

  @Prop({ required: true })
  gearboxType: string;
  @Prop({ required: true })
  hoursePower: number;
  @Prop({ required: true })
  fuelType?: string;
  @Prop({ required: false })
  photo: string;
  @Prop({ type: [Warning], required: false, default: [] })
  warnings?: Warning[];
  @Prop({ type: [Cost], required: false, default: [] })
  costs?: Cost[];
}

export const CarSchema = SchemaFactory.createForClass(Car);

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  firstname: string;

  @Prop({ required: false })
  car?: Car;
}

export const UserSchema = SchemaFactory.createForClass(User);
