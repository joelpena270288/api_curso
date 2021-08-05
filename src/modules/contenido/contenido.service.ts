import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContenidoRepository } from './contenido.repository';
import { Contenido } from './contenido.entity';
import { User } from '../user/user.entity';
import { createContentDto } from './dto/create.dto';
import { ActividadRepository } from '../actividad/actividad.repository';
import { Actividad } from '../actividad/actividad.entity';

@Injectable()
export class ContenidoService {
  constructor(
    @InjectRepository(ContenidoRepository)
    private readonly _contenidoRepository: ContenidoRepository,
    private readonly _actividadRepository: ActividadRepository,
  ) {}

  async create(
    contenido: createContentDto,
    user: User,
    idactividad: string,
  ): Promise<Contenido> {
  
    const actividada: Actividad = await this.validarUsuario(idactividad, user);
    const conten: Contenido = new Contenido();
    conten.cuerpo = contenido.cuerpo;
    conten.actividad = actividada;
    const savedContenido: Contenido = await this._contenidoRepository.save(conten);

    return savedContenido;
  }
  async getAllByIdClase(actividadid: string): Promise<Contenido[]> {
    const contenido: Contenido[] = await this._contenidoRepository.find({
      where: { actividad: actividadid },
    });
    return contenido;
  }
  async update(
    idcontenido: string,
    contenido: Contenido,
    user: User,
  ): Promise<boolean> {
    const contenidofound = await this._contenidoRepository
      .createQueryBuilder('contenido')
      .innerJoin('contenido.actividad', 'actividad')
      .innerJoin('actividad.clase', 'clase')
      .innerJoin('clase.modulo', 'modulo')
      .innerJoin('modulo.curso', 'curso')
     
      .where('contenido.id = :idcontenido', { idcontenido: idcontenido })
      .andWhere('curso.user = :user', { user: user.id })
      .getOne();
    if (!contenidofound) {
      throw new NotFoundException('this Content does not found');
    }
    contenidofound.cuerpo = contenido.cuerpo;

    contenidofound.updatedAt = new Date();
    let savedcontenido;
    try {
      savedcontenido = await this._contenidoRepository.save(contenidofound);
    } catch (e) {
      console.log(e);
    }
    if (!savedcontenido) {
      throw new NotFoundException('Dont was saved content');
    }
    return true;
  }

  async delete(idcontenido: string, user: User): Promise<boolean> {
    const contenidoFound = await this._contenidoRepository
      .createQueryBuilder('contenido')
      .innerJoin('contenido.actividad', 'actividad')
      .innerJoin('actividad.clase', 'clase')
      .innerJoin('clase.modulo', 'modulo')
      .innerJoin('modulo.curso', 'curso')
      
      .where('contenido.id = :idcontenido', { idcontenido: idcontenido })
      .andWhere('curso.user = :user', { user: user.id })
      .getOne();

    if (!contenidoFound) {
      throw new NotFoundException('Content does not exist');
    }
    await this._contenidoRepository.delete(contenidoFound);
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
