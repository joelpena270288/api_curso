import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CursoService } from './curso.service';
import { CursoRepository } from './curso.repository';
import { ModuloRepository } from '../modulo/modulo.repository';

import { CursoController } from './curso.controller';

import { AuthModule } from '../auth/auth.module';
import { CursosProgresoRepository } from '../cursos-progreso/cursos-progreso.repository';
import { CursosPasadosRepository } from '../cursos-pasados/cursos-pasados.repository';
import { UserRepository } from '../user/user.repository';
import { PlanRepository } from '../plan/plan.repository';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      CursoRepository,
      ModuloRepository,
      CursosProgresoRepository,
      CursosPasadosRepository,
      UserRepository,
      PlanRepository,
    ]),
    AuthModule,
  ],
  exports: [TypeOrmModule],
  providers: [CursoService],
  controllers: [CursoController],
})
export class CursoModule {}
