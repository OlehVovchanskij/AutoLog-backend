import { IsString } from 'class-validator';
export class AddWarningDto {
  @IsString()
  text: string;
  @IsString()
  importance: string;
}
