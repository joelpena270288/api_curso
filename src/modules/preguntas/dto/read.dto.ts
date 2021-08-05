import { Type } from 'class-transformer';
import { IsNumber, IsString, IsBoolean, IsDate } from 'class-validator';
export class readPreguntaDto {

  @IsString()
  name: string;
  
}