/*
https://docs.nestjs.com/providers#services
*/
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClasesFaltantes } from './clases-faltantes.entity';
import { ClasesFaltantesRepository } from './clases-faltantes.repository';
import { status } from '../../shared/entity-status.enum';
import { User } from '../user/user.entity';
import { Actividad } from '../actividad/actividad.entity';

@Injectable()
export class ClasesFaltantesService {
  constructor(
    @InjectRepository(ClasesFaltantesRepository)
    private readonly _clasesFaltantesRepository: ClasesFaltantesRepository,
  ) {}

  async getAllByIdProgress(
    idprogress: string,
    user: User,
  ): Promise<ClasesFaltantes> {
    if (!idprogress) {
      throw new BadRequestException('id must be sent');
    }
    const faltantes: ClasesFaltantes = await this._clasesFaltantesRepository
      .createQueryBuilder('faltantes')
      .innerJoin('faltantes.moduloActual', 'moduloActual')
      .leftJoinAndSelect('faltantes.clases', 'clases')
      .addOrderBy('clases.numeroclase')
      .innerJoin('moduloActual.cursoprogress', 'cursoprogress')
      .where('cursoprogress.id = :idprogress', { idprogress: idprogress })
      .andWhere('cursoprogress.user = :user', { user: user.id })
      .getOne();
    return faltantes;
  }

  async ObtenerClaseByIdFalAndIdClass(
    idfalta: string,
    idclase: string,
    user: User,
  ): Promise<ClasesFaltantes> {
    let faltantes: ClasesFaltantes;
    try {
      faltantes = await this._clasesFaltantesRepository
        .createQueryBuilder('faltantes')
        .innerJoin('faltantes.moduloActual', 'moduloActual')
        .innerJoin('moduloActual.cursoprogress', 'cursoprogress')
        .leftJoinAndSelect('faltantes.clases', 'clases')
        .where('faltantes.id = :idfalta', { idfalta: idfalta })
        .andWhere('clases.id = :idclase', { idclase: idclase })
        .andWhere('cursoprogress.user = :user', { user: user.id })
        .getOne();
    } catch (e) {
      throw new BadRequestException('you dont have permission');
    }
    return faltantes;
  }

  async getAllActivitiesByIdClase(
    idclase: string,
    user: User,):Promise<Actividad[]> {
      let faltantes: ClasesFaltantes;
    try {
      faltantes = await this._clasesFaltantesRepository
        .createQueryBuilder('faltantes')
        .innerJoin('faltantes.moduloActual', 'moduloActual')
        .innerJoin('moduloActual.cursoprogress', 'cursoprogress')
        .leftJoinAndSelect('faltantes.clases', 'clases')
        .leftJoinAndSelect('clases.actividades', 'actividades')
        .addOrderBy('actividades.numero')
        .leftJoinAndSelect('actividades.contenidos', 'contenidos')
        .addOrderBy('actividades.numero')
        .leftJoinAndSelect('actividades.videos', 'videos')
        .leftJoinAndSelect('actividades.actividades_extraclases', 'actividades_extraclases')
        .leftJoinAndSelect('actividades.documentos', 'documentos')        
        .andWhere('clases.id = :idclase', { idclase: idclase })
        .andWhere('cursoprogress.user = :user', { user: user.id })
        .getOne();
    } catch (e) {
      throw new BadRequestException('you dont have permission');
    }
    return faltantes.clases[0].actividades;
    }
}
