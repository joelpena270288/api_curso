import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActividadRepository } from './actividad.repository';
import { ClaseRepository } from '../clase/clase.repository';
import { Actividad } from './actividad.entity';
import { status } from '../../shared/entity-status.enum';
import { User } from '../user/user.entity';
import { Video } from '../video/video.entity';
import { Contenido } from '../contenido/contenido.entity';
import { ActividadesExtraclase } from '../actividad-extraclase/actividadextraclase.entity';
import { PreguntaHtml } from '../pregunta-html/preguntahtml.entity';
import { Documento } from '../documento/documento.entity';
import { DocumentoRepository } from '../documento/documento.repository';
import { VideoRepository } from '../video/video.repository';
import { ContenidoRepository } from '../contenido/contenido.repository';
import { PreguntaHtmlRepository } from '../pregunta-html/pregunta_html.repository';
import { ActividadExtraclaseRepository } from '../actividad-extraclase/actividadextraclase.repository';

@Injectable()
export class ActividadService {
  constructor(
    @InjectRepository(ActividadRepository)
    private readonly _actividadRepository: ActividadRepository,
    @InjectRepository(ClaseRepository)
    private readonly _claseRepository: ClaseRepository,
    @InjectRepository(VideoRepository)
    private readonly _videoRepository: VideoRepository,
    @InjectRepository(DocumentoRepository)
    private readonly _documentoRepository: DocumentoRepository,
    @InjectRepository(ContenidoRepository)
    private readonly _contenidoRepository: ContenidoRepository,
    @InjectRepository(PreguntaHtmlRepository)
    private readonly _preguntaHtmlRepository: PreguntaHtmlRepository,
    @InjectRepository(ActividadExtraclaseRepository)
    private readonly _actividadExtraclaseRepository: ActividadExtraclaseRepository,
  ) {}
  async create(actividad: Actividad, user: User): Promise<Actividad> {
    let clase;
    try {
      clase = await this._claseRepository
        .createQueryBuilder('clase')
        .innerJoin('clase.modulo', 'modulo')
        .innerJoin('modulo.curso', 'curso')
        
        .where('curso.user = :user', { user: user.id })
        .getOne();
    } catch (e) {
      throw new BadRequestException(e);
    }

    const savedActividad: Actividad = await this._actividadRepository.save(
      actividad,
    );
    return savedActividad;
  }
  async get(actividadid: string, user: User): Promise<Actividad> {
    if (!actividadid) {
      throw new BadRequestException('id must be sent');
    }
    let actividad;
    try {
      actividad = await this._actividadRepository
        .createQueryBuilder('actividad')
        .innerJoin('actividad.clase', 'clase')
        .innerJoin('clase.modulo', 'modulo')
        .innerJoin('modulo.curso', 'curso')        
        .where('actividad.id = :actividadid', { actividadid: actividadid })
        .andWhere('curso.user = :user', { user: user.id })
        .getOne();
    } catch (e) {
      console.log(e);
    }
    if (!actividad) {
      throw new NotFoundException('this activity does not found');
    }
    return actividad;
  }
  async getAll(user: User): Promise<Actividad[]> {
    let actividad: Actividad[];
    try {
      actividad = await this._actividadRepository
        .createQueryBuilder('actividad')
        .innerJoin('actividad.clase', 'clase')
        .innerJoin('clase.modulo', 'modulo')
        .innerJoin('modulo.curso', 'curso')        
       
        .andWhere('curso.user = :user', { user: user.id })
        .getMany();
    } catch (e) {
      console.log(e);
    }
    if (!actividad) {
      throw new NotFoundException('this activity does not found');
    }
    return actividad;
  }

  async update(
    actividadid: string,
    actividadcompleta: Actividad,
    user: User,
  ): Promise<Actividad> {
    let actividad;
    try {
      actividad = await this._actividadRepository
        .createQueryBuilder('actividad')
        .innerJoin('actividad.clase', 'clase')
        .innerJoin('clase.modulo', 'modulo')
        .innerJoin('modulo.curso', 'curso')        
        .where('actividad.id = :actividadid', { actividadid: actividadid })
        .andWhere('curso.user = :user', { user: user.id })
        .getOne();
    } catch (e) {
      console.log(e);
    }
    if (!actividad) {
      throw new NotFoundException('this activity does not found');
    }

    if (actividadcompleta.nombre) {
      actividad.nombre = actividadcompleta.nombre;
    }

    if (actividadcompleta.descripcion) {
      actividad.descripcion = actividadcompleta.descripcion;
    }
    if (actividadcompleta.numero > 0) {
      actividad.numero = actividadcompleta.numero;
    }
    return await this._actividadRepository.save(actividad);
  }
  async delete(actividadId: string, user: User): Promise<Actividad> {
    const actividadFound = await this._actividadRepository
      .createQueryBuilder('actividad')
      .leftJoinAndSelect('actividad.clase', 'clase')
      .innerJoin('clase.modulo', 'modulo')
      .innerJoin('modulo.curso', 'curso')    
      .where('actividad.id = :actividadid', { actividadid: actividadId })
      .andWhere('curso.user = :user', { user: user.id })
      .getOne();

    if (!actividadFound) {
      throw new NotFoundException('Activity does not exist');
    }
    await this._actividadRepository.delete(actividadFound);
    return actividadFound;
  }
  async getAllByIdClase(claseid: string, user: User): Promise<Actividad[]> {
    let actividad;
    try {
      actividad = await this._actividadRepository
        .createQueryBuilder('actividad')
        .leftJoinAndSelect('actividad.videos', 'videos')
        .leftJoinAndSelect('actividad.documentos', 'documentos')
        .leftJoinAndSelect('actividad.contenidos', 'contenidos')
        .leftJoinAndSelect('actividad.preguntas_html', 'preguntas_html')
        .leftJoinAndSelect(
          'actividad.actividades_extraclases',
          'actividades_extraclases',
        )
        .innerJoin('actividad.clase', 'clase')
        .innerJoin('clase.modulo', 'modulo')
        .innerJoin('modulo.curso', 'curso')
        .where('clase.id = :claseid', { claseid: claseid })
        .andWhere('curso.user = :user', { user: user.id })
        .addOrderBy('actividad.numero')
        .getMany();
    } catch (e) {
      throw new NotFoundException('Error in consult');
    }
    return actividad;
  }
}
