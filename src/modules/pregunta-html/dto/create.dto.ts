import { Type } from 'class-transformer';
import { IsNumber, IsString, IsBoolean } from 'class-validator';
export class createHtmltDto {
  @IsString()
  pregunta: string;
  @IsBoolean()
  respuesta: boolean;
}