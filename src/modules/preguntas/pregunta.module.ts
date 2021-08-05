import { PreguntaService } from './pregunta.service';
import { PreguntaController } from './pregunta.controller';
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PreguntaRepository } from './pregunta.repository';

import {ModuloRepository} from '../modulo/modulo.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PreguntaRepository,ModuloRepository]), AuthModule],
  controllers: [PreguntaController],
  providers: [PreguntaService],
})
export class PreguntaModule {}
