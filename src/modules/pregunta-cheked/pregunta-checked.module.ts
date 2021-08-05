import { PreguntaCheckedController } from './pregunta-checked.controller';
import { PreguntaCheckedService } from './pregunta-checked.service';
import { Module } from '@nestjs/common';
import { PreguntaCheckedRepository } from './pregunta-checked.repository';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ModuloRepository } from '../modulo/modulo.repository';
import { PreguntaRepository } from '../preguntas/pregunta.repository';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      PreguntaCheckedRepository,
      PreguntaRepository,
      ModuloRepository,
    ]),
    AuthModule,
  ],
  controllers: [PreguntaCheckedController],
  providers: [PreguntaCheckedService],
})
export class PreguntaCheckedModule {}
