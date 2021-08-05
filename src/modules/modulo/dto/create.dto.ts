import { Type } from 'class-transformer';
import { IsNumber, IsString, IsBoolean, IsDate } from 'class-validator';
export class createModuloDto {
  @IsNumber()
  numeromodulo: number;
  @IsString()
  nombre: string;
  @IsString()
  descripcion: string;
  @IsNumber()
  nota: number;
  @IsDate()
  fecha_inicio: Date;
  @IsString()
  idcurso: string;
}