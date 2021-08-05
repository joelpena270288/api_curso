import { Type } from 'class-transformer';
import { IsNumber, IsString, IsBoolean, IsDate } from 'class-validator';
import { readPreguntaDto } from '../../preguntas/dto/read.dto';
export class createMultiDto {
  @IsString()
  enunciado: string; 
  preguntas: readPreguntaDto[];
  respuestas: string;
 
}