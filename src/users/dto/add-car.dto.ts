import { IsNumber, IsString } from 'class-validator';

export class AddCarDto {
  @IsString()
  brand: string;

  @IsString()
  modelName: string;

  @IsNumber()
  engineVolume: string;

  @IsNumber()
  year: number;

  @IsString()
  driveType: string;

  @IsNumber()
  mileage: number;

  @IsNumber()
  lastOilChange: number;

  @IsNumber()
  fuelConsumption: number;

  @IsNumber()
  fuelType?: string;
  @IsString()
  gearboxType: string;
  @IsNumber()
  hoursePower: number;
  @IsString()
  photo: string;
}
