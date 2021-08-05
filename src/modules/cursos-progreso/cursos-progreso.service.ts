import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../user/user.entity';
import { CursosProgresoRepository } from './cursos-progreso.repository';
import { CursosProgreso } from './cursos-progreso.entity';
import { Curso } from '../curso/curso.entity';
import { CursoRepository } from '../curso/curso.repository';
import { status } from '../../shared/entity-status.enum';
import { createQueryBuilder } from 'typeorm';

import { PreguntaHtmlRepository } from '../pregunta-html/pregunta_html.repository';
import { PreguntaHtml } from '../pregunta-html/preguntahtml.entity';

import { Clase } from '../clase/clase.entity';
import { ClaseRepository } from '../clase/clase.repository';

import { ModulosPasadosRepository } from '../modulos-pasados/modulos-pasados.repository';
import { ModulosPasados } from '../modulos-pasados/modulos-pasados.entity';
import { ModuloActual } from '../modulo-actual/modulo-actual.entity';
import { ModuloActualRepository } from '../modulo-actual/modulo-actual.repository';
import { ExamenFinalRepository } from '../examen-final-curso/examen-final.repository';
import { ExamenFinal } from '../examen-final-curso/examen-final.entity';
import { CursosPasadosRepository } from '../cursos-pasados/cursos-pasados.repository';
import { ExamenModuloRepository } from '../examen-modulo/examen-modulo.repository';

import { CursosPasados } from '../cursos-pasados/cursos-pasados.entity';
import { copyFile } from 'node:fs';
import { Modulo } from '../modulo/modulo.entity';
import { ModuloRepository } from '../modulo/modulo.repository';
import { ClasesFaltantesRepository } from '../clases-faltantes/clases-faltantes.repository';
import { ClasesFaltantes } from '../clases-faltantes/clases-faltantes.entity';
import { ClasePasada } from '../clases-pasadas/clases-pasadas.entity';
import { ClasePasadaRepository } from '../clases-pasadas/clase-pasada.repository';

@Injectable()
export class CursosProgresoService {
  constructor(
    @InjectRepository(CursosProgresoRepository)
    private readonly _cursoProgresoRepository: CursosProgresoRepository,

    @InjectRepository(Curso)
    private readonly _cursoRepository: CursoRepository,

    @InjectRepository(PreguntaHtmlRepository)
    private readonly _preguntaHtmlRepository: PreguntaHtmlRepository,

    @InjectRepository(ClaseRepository)
    private readonly _claseRepository: ClaseRepository,
    @InjectRepository(ModulosPasadosRepository)
    private readonly _modulosPasadosRepository: ModulosPasadosRepository,
    @InjectRepository(ModuloActualRepository)
    private readonly _moduloActualRepository: ModuloActualRepository,
    @InjectRepository(ExamenFinalRepository)
    private readonly _examenFinalRepository: ExamenFinalRepository,
    @InjectRepository(CursosPasadosRepository)
    private readonly _cursosPasadosRepository: CursosPasadosRepository,
    @InjectRepository(ExamenModuloRepository)
    private readonly _examenModuloRepository: ExamenModuloRepository,
    @InjectRepository(ModuloRepository)
    private readonly _moduloRepository: ModuloRepository,
    @InjectRepository(ClasesFaltantesRepository)
    private readonly _clasesFaltantesRepository: ClasesFaltantesRepository,
    @InjectRepository(ClasePasadaRepository)
    private readonly _clasePasadaRepository: ClasePasadaRepository,
  ) {}

  async create(id: string, user: User): Promise<CursosProgreso> {
    const foundcursoporgress: CursosProgreso = await this._cursoProgresoRepository
    .createQueryBuilder('cursoprogreso')
    .innerJoin('cursoprogreso.user', 'user')
    .innerJoin('cursoprogreso.curso', 'curso') 
    .where('curso.id = :idcurso', { idcurso: id })  
    .where('curso.status = :status', { status: status.ACTIVE })
    .andWhere('cursoprogreso.user = :user', { user: user.id })
    .getOne();
    if(foundcursoporgress){
      throw new BadRequestException("you are enrolled in this course");
    }
    const curso: Curso = await this._cursoRepository
      .createQueryBuilder('curso')
      .where('curso.status = :status', { status: status.ACTIVE })
      .andWhere('curso.disponible = :disponible', { disponible: true })
      .andWhere('curso.id = :id', { id: id })
      .getOne();
    if (!curso) {
      throw new NotFoundException('this course not exist ');
    }
    const primerModulo = await this._moduloRepository
      .createQueryBuilder('modulo')
      .addOrderBy('modulo.numeromodulo')
      .innerJoin('modulo.curso', 'curso')
      .leftJoinAndSelect('modulo.clases', 'clases')
      .where('curso.status = :status', { status: status.ACTIVE })
      .andWhere('curso.disponible = :disponible', { disponible: true })
      .andWhere('curso.id = :idcurso', { idcurso: curso.id })
      .getOne();

    if (!primerModulo) {
      throw new NotFoundException('this course not have any module ');
    }
    if (primerModulo.clases.length < 1) {
      throw new NotFoundException('this course ned more lesson ');
    }

    const clasesfaltantes = new ClasesFaltantes();
    clasesfaltantes.clases = primerModulo.clases;
    const clasesPasadas = new ClasePasada();
    const savedclasesfaltantes = await this._clasesFaltantesRepository.save(
      clasesfaltantes,
    );
    const savedclasesPasadas = await this._clasePasadaRepository.save(
      clasesPasadas,
    );
    const moduloActual = new ModuloActual();
    moduloActual.modulo = primerModulo;
    moduloActual.clasespasadas = savedclasesPasadas;
    moduloActual.clasesfaltantes = savedclasesfaltantes;
    const savedModuloActual = await this._moduloActualRepository.save(
      moduloActual,
    );
    const cursoProgreso: CursosProgreso = new CursosProgreso();
    cursoProgreso.user = user;
    cursoProgreso.curso = curso;
    cursoProgreso.moduloActual = savedModuloActual;

    const saveCursoProgreso = this._cursoProgresoRepository.save(cursoProgreso);

    return saveCursoProgreso;
  }

  async getAllByUser(user: User): Promise<CursosProgreso[]> {
    const curso: CursosProgreso[] = await this._cursoProgresoRepository
      .createQueryBuilder('cursoprogreso')
      .innerJoin('cursoprogreso.user', 'user')
      .leftJoinAndSelect('cursoprogreso.curso', 'curso')
      .where('curso.status = :status', { status: status.ACTIVE })
      .andWhere('cursoprogreso.user = :user', { user: user.id })
      .getMany();
    return curso;
  }

  async get(idprogress: string, user: User): Promise<CursosProgreso> {
    const curso: CursosProgreso = await this._cursoProgresoRepository
      .createQueryBuilder('cursoprogreso')
      .innerJoin('cursoprogreso.user', 'user')
      .leftJoinAndSelect('cursoprogreso.curso', 'curso')
      .where('cursoprogreso.id = :idprogress', { idprogress: idprogress })
      .andWhere('curso.status = :status', { status: status.ACTIVE })
      .andWhere('cursoprogreso.user = :user', { user: user.id })
      .getOne();
    return curso;
  }
  async EvaluarClase(idclasefaltante: string, idclase: string, user: User): Promise<boolean>{

return true;
  }
}
