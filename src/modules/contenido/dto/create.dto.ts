import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
export class createContentDto {
  @IsString()
  cuerpo: string;
}
