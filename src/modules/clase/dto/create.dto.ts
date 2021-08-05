import { Type } from 'class-transformer';
import { IsNumber, IsString, IsBoolean, IsDate } from 'class-validator';
export class createClaseDto {
  @IsNumber()
  numeroclase: number;
  @IsString()
  nombre: string;
  @IsString()
  descripcion: string;
  @IsNumber()
  nota: number;
  @IsDate()
  fecha_inicio: Date;
  @IsString()
  idmodulo: string;
}