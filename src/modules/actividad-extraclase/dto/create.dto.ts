import { Type } from 'class-transformer';
import { IsNumber, IsString, IsBoolean, IsDate } from 'class-validator';
export class createActividadExtraclasetDto {
  @IsString()
  orientacion: string;
  @IsString()
  documendo: string;
  @IsNumber()
  punto: number;
  @IsDate()
  fecha_entrega: Date;
}