import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateCarDto {
  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsNumber()
  engineVolume?: string;

  @IsOptional()
  @IsNumber()
  year?: number;

  @IsOptional()
  @IsString()
  driveType?: string;

  @IsOptional()
  @IsNumber()
  mileage?: number;

  @IsOptional()
  @IsNumber()
  lastOilChange?: number;

  @IsOptional()
  @IsNumber()
  fuelConsumption?: number;
  @IsOptional()
  @IsNumber()
  hoursePower?: number;
  @IsOptional()
  @IsString()
  gearboxType?: string;

  @IsOptional()
  @IsString()
  photo?: string;
}
