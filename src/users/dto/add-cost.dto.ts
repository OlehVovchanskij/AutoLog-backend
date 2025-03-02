import { IsString } from 'class-validator';
export class AddCostDto {
  @IsString()
  type: string;
  @IsString()
  cost?: string;
}
