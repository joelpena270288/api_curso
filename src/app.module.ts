import { ClasesFaltantesModule } from './modules/clases-faltantes/clases-faltantes.module';
import { ClasesFaltantesService } from './modules/clases-faltantes/clases-faltantes.service';
import { ClasesFaltantesController } from './modules/clases-faltantes/clases-faltantes.controller';

import { ClasePasadaModule } from './modules/clases-pasadas/clase-pasada.module';
import { ClasePasadaService } from './modules/clases-pasadas/clase-pasada.service';
import { ClasePasadaController } from './modules/clases-pasadas/clase-pasada.controller';
import { ModuloActualModule } from './modules/modulo-actual/modulo-actual.module';
import { ModulosPasadosModule } from './modules/modulos-pasados/modulos-pasados.module';

import { PreguntaVfModule } from './modules/pregunta-vf/pregunta-vf.module';

import { ExamenFinalModule } from './modules/examen-final-curso/examen-final.module';

import { PreguntaValueModule } from './modules/preguntas-valueVoF/pregunta-valueVoF.module';


import { PreguntaMultiselectedModule } from './modules/pregunta-multiselected/pregunta-multiselected.module';

import { PreguntaCheckedModule } from './modules/pregunta-cheked/pregunta-checked.module';

import { ExamenModuloModule } from './modules/examen-modulo/examen-modulo.module';

import { PlanModule } from './modules/plan/plan.module';

import { CursosProgresoModule } from './modules/cursos-progreso/cursos-progreso.module';


import { Module } from '@nestjs/common';
import { Configuration } from './config/config.keys';
import { ConfigService } from './config/config.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './modules/user/user.module';
import { CursoModule } from './modules/curso/curso.module';
import { ConfigModule } from './config/config.module';
import { RoleModule } from './modules/role/role.module';
import { AuthModule } from './modules/auth/auth.module';
import { ModuloModule } from './modules/modulo/modulo.module';
import { ClaseModule } from './modules/clase/clase.module';
import { ActividadModule } from './modules/actividad/actividad.module';
import { VideoModule } from './modules/video/video.module';
import { DocumentoModule } from './modules/documento/documento.module';
import { ContenidoModule } from './modules/contenido/contenido.module';
import { PreguntaHtmlModule } from './modules/pregunta-html/pregunta-html.module';
import { ActividadExtraclaseModule } from './modules/actividad-extraclase/actividad-extraclase.module';
import { NotaModule } from './modules/nota/nota.module';
@Module({
  imports: [
    ClasesFaltantesModule,
    ModuloActualModule,
    ModulosPasadosModule,
    ClasePasadaModule,

    PreguntaVfModule,

    ExamenFinalModule,

    PreguntaValueModule,

    PreguntaVfModule,
    PreguntaMultiselectedModule,

    PreguntaCheckedModule,

    ExamenModuloModule,


    PlanModule,

    CursosProgresoModule,

    DatabaseModule,
    UserModule,
    CursoModule,
    ConfigModule,
    RoleModule,
    AuthModule,
    ModuloModule,
    ClaseModule,
    ActividadModule,
    VideoModule,
    DocumentoModule,
    ContenidoModule,

    PreguntaHtmlModule,
    ActividadExtraclaseModule,
    NotaModule,
  ],
  controllers: [
  
  ],
  providers: [
  
  ],
})
export class AppModule {
  static port: number | string;
  constructor(private readonly _configService: ConfigService) {
    AppModule.port = this._configService.get(Configuration.PORT);
  }
}
