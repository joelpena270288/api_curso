import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActividadExtraclaseRepository } from './actividadextraclase.repository';
import { ActividadesExtraclase } from './actividadextraclase.entity';
import { User } from '../user/user.entity';
import { ActividadRepository } from '../actividad/actividad.repository';
import { Actividad } from '../actividad/actividad.entity';
import {createActividadExtraclasetDto } from './dto/create.dto';
@Injectable()
export class ActividadExtraclaseService {
  constructor(
    @InjectRepository(ActividadExtraclaseRepository)
    private readonly _actividadextraclaseRepository: ActividadExtraclaseRepository,
    private readonly _actividadRepository: ActividadRepository,
  ) {}

  async create(
    extraclase: createActividadExtraclasetDto,
    user: User,
    idactividad: string,
  ): Promise<ActividadesExtraclase> {
    const actividada: Actividad = await this.validarUsuario(idactividad, user);
    const homework: ActividadesExtraclase = new ActividadesExtraclase();
    homework.orientacion = extraclase.orientacion;
    homework.actividad = actividada;
  
    homework.punto = extraclase.punto;
    homework.fecha_entrega = extraclase.fecha_entrega;
    const savedPregunta: ActividadesExtraclase = await this._actividadextraclaseRepository.save(
      homework,
    );
    return savedPregunta;
  }
  async getAllByIdClase(actividadid: string, user: User): Promise<ActividadesExtraclase[]> {

    
    const actividadfound: ActividadesExtraclase[] = await this._actividadextraclaseRepository
      .createQueryBuilder('actividadextra')
      .innerJoin('actividadextra.actividad', 'actividad')
      .innerJoin('actividad.clase', 'clase')
      .innerJoin('clase.modulo', 'modulo')
      .innerJoin('modulo.curso', 'curso')      
      .where('actividad.id = :actividadid', { actividadid: actividadid })
      .andWhere('curso.user = :user', { user: user.id })
      .getMany();
    return actividadfound;
  }
  async update(
    idactividad: string,
    actividad: ActividadesExtraclase,
    user: User,
  ): Promise<boolean> {
    const actividadfound = await this._actividadextraclaseRepository
      .createQueryBuilder('actividadextra')
      .innerJoin('actividadextra.actividad', 'actividad')
      .innerJoin('actividad.clase', 'clase')
      .innerJoin('clase.modulo', 'modulo')
      .innerJoin('modulo.curso', 'curso')      
      .where('actividadextra.id = :idactividad', { idactividad: idactividad })
      .andWhere('curso.user = :user', { user: user.id })
      .getOne();
    if (!actividadfound) {
      throw new NotFoundException('this Activity does not found');
    }
    actividadfound.orientacion = actividad.orientacion;
    
    actividadfound.fecha_entrega = actividad.fecha_entrega;
    actividadfound.punto = actividad.punto;
    actividadfound.updatedAt = new Date();

    let savedactividad;
    try {
      savedactividad = await this._actividadextraclaseRepository.save(
        actividadfound,
      );
    } catch (e) {
      console.log(e);
    }
    if (!savedactividad) {
      throw new NotFoundException('Dont was saved this homework');
    }
    return true;
  }
  async delete(homeworkid: string, user: User): Promise<boolean> {
    const homeworkFound = await this._actividadextraclaseRepository
      .createQueryBuilder('actividadextra')
      .innerJoin('actividadextra.actividad', 'actividad')
      .innerJoin('actividad.clase', 'clase')
      .innerJoin('clase.modulo', 'modulo')
      .innerJoin('modulo.curso', 'curso')
      
      .where('actividadextra.id = :homeworkid', { homeworkid: homeworkid })
      .andWhere('curso.user = :user', { user: user.id })
      .getOne();

    if (!homeworkFound) {
      throw new NotFoundException('Homework does not exist');
    }
    await this._actividadextraclaseRepository.delete(homeworkFound);
    return true;
  }
  async validarUsuario(idactividad: string, user: User): Promise<Actividad> {
    const actividad = await this._actividadRepository
      .createQueryBuilder('actividad')
      .innerJoin('actividad.clase', 'clase')
      .innerJoin('clase.modulo', 'modulo')
      .innerJoin('modulo.curso', 'curso')
      
      .where('actividad.id = :idactividad', { idactividad: idactividad })
      .andWhere('curso.user = :user', { user: user.id })
      .getOne();
    if (!actividad) {
      throw new BadRequestException(
        'you dont have permission for this activity',
      );
    }
    return actividad;
  }
}
