import { Type } from 'class-transformer';
import { IsNumber, IsString, IsBoolean, IsDate } from 'class-validator';
import { readPreguntaDto } from '../../preguntas/dto/read.dto';
export class createCheckedDto {
  @IsString()
  enunciado: string;
  @IsString()
  pregunta_correcta: string;
  preguntas: readPreguntaDto[];
 
}