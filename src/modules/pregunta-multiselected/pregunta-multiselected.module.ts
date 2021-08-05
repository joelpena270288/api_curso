import { PreguntaMultiselectedController } from './pregunta-multiselected.controller';
import { PreguntaMultiselectedService } from './pregunta-multiselected.service';
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';

import {PreguntaMultiselectedRepository} from './pregunta-multiselected.repository';
import { ModuloRepository } from "../modulo/modulo.repository";
import { PreguntaRepository } from '../preguntas/pregunta.repository';

@Module({
  imports: [ TypeOrmModule.forFeature([
    PreguntaMultiselectedRepository,
    PreguntaRepository,
    ModuloRepository,
  ]),
  AuthModule,],
  controllers: [PreguntaMultiselectedController],
  providers: [PreguntaMultiselectedService],
})
export class PreguntaMultiselectedModule {}
