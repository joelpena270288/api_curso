import { Type } from 'class-transformer';
import { IsNumber, IsString, IsBoolean, IsDate } from 'class-validator';
export class readPreguntaValueVoFDto {

  @IsString()
  name: string;
  @IsBoolean()
  respuesta: boolean;
  
}