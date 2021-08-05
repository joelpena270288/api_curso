import { CursosProgresoService } from './cursos-progreso.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CursosProgresoRepository } from './cursos-progreso.repository';
import { AuthModule } from '../auth/auth.module';
import { CursoRepository } from '../curso/curso.repository';
import { CursosProgresoController } from './cursos-progreso.controller';
import { PreguntaHtmlRepository } from '../pregunta-html/pregunta_html.repository';

import { ClaseRepository } from '../clase/clase.repository';
import { ModulosPasadosRepository } from '../modulos-pasados/modulos-pasados.repository';
import { ModuloActualRepository } from '../modulo-actual/modulo-actual.repository';
import { ExamenFinalRepository } from '../examen-final-curso/examen-final.repository';
import { CursosPasadosRepository } from '../cursos-pasados/cursos-pasados.repository';
import { ExamenModuloRepository } from '../examen-modulo/examen-modulo.repository';
import { ModuloRepository } from '../modulo/modulo.repository';
import { ClasesFaltantesRepository } from '../clases-faltantes/clases-faltantes.repository';
import { ClasePasadaRepository } from '../clases-pasadas/clase-pasada.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CursoRepository,
      
      CursosProgresoRepository,     
    
      PreguntaHtmlRepository,
    
      ClaseRepository,
      ModulosPasadosRepository,
      ModuloActualRepository,
      ExamenFinalRepository,
      CursosPasadosRepository,
      ExamenModuloRepository,
      ModuloRepository,
      ClasesFaltantesRepository,
      ClasePasadaRepository,
    ]),
    AuthModule,
  ],
  controllers: [CursosProgresoController],
  providers: [CursosProgresoService],
})
export class CursosProgresoModule {
  
}
