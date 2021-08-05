import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PreguntaHtmlRepository } from './pregunta_html.repository';
import { PreguntaHtml } from './preguntahtml.entity';
import { User } from '../user/user.entity';
import { ActividadRepository } from '../actividad/actividad.repository';
import { Actividad } from '../actividad/actividad.entity';
import { createHtmltDto } from './dto/create.dto';
import { PreguntaEstundentReadHtmlDto } from './dto/pregunta-htm-estundentReadDto';
import { plainToClass } from 'class-transformer';
@Injectable()
export class PreguntaHtmlService {
  constructor(
    @InjectRepository(PreguntaHtmlRepository)
    private readonly _preguntahtmlRepository: PreguntaHtmlRepository,
    private readonly _actividadRepository: ActividadRepository,
  ) {}

  async create(
    preguntaHtml: createHtmltDto,
    user: User,
    idactividad: string,
  ): Promise<PreguntaHtml> {
    const actividada: Actividad = await this.validarUsuario(idactividad, user);
    const html: PreguntaHtml = new PreguntaHtml();
    html.pregunta = preguntaHtml.pregunta;
    html.actividad = actividada;
    html.respuesta = preguntaHtml.respuesta;
    const savedPregunta: PreguntaHtml = await this._preguntahtmlRepository.save(
      html,
    );
    return savedPregunta;
  }
  async getAllByIdClase(
    actividadid: string,
    user: User,
  ): Promise<PreguntaHtml[]> {
    const preguntafound: PreguntaHtml[] = await this._preguntahtmlRepository
      .createQueryBuilder('pregunta')
      .innerJoin('pregunta.actividad', 'actividad')
      .innerJoin('actividad.clase', 'clase')
      .innerJoin('clase.modulo', 'modulo')
      .innerJoin('modulo.curso', 'curso')

      .where('actividad.id = :actividadid', { actividadid: actividadid })
      .andWhere('curso.user = :user', { user: user.id })
      .getMany();
    return preguntafound;
  }
  async update(
    idpregunta: string,
    pregunta: PreguntaHtml,
    user: User,
  ): Promise<boolean> {
    const preguntafound = await this._preguntahtmlRepository
      .createQueryBuilder('pregunta')
      .innerJoin('pregunta.actividad', 'actividad')
      .innerJoin('actividad.clase', 'clase')
      .innerJoin('clase.modulo', 'modulo')
      .innerJoin('modulo.curso', 'curso')

      .where('pregunta.id = :idpregunta', { idpregunta: idpregunta })
      .andWhere('curso.user = :user', { user: user.id })
      .getOne();
    if (!preguntafound) {
      throw new NotFoundException('this Question does not found');
    }

    preguntafound.pregunta = pregunta.pregunta;
    preguntafound.respuesta = pregunta.respuesta;
    preguntafound.updatedAt = pregunta.updatedAt;
    let savedpregunta;
    try {
      savedpregunta = await this._preguntahtmlRepository.save(preguntafound);
    } catch (e) {
      console.log(e);
    }
    if (!savedpregunta) {
      throw new NotFoundException('Dont was saved this Question');
    }
    return true;
  }
  async delete(preguntaid: string, user: User): Promise<boolean> {
    const questionFound = await this._preguntahtmlRepository
      .createQueryBuilder('pregunta')
      .innerJoin('pregunta.actividad', 'actividad')
      .innerJoin('actividad.clase', 'clase')
      .innerJoin('clase.modulo', 'modulo')
      .innerJoin('modulo.curso', 'curso')

      .where('pregunta.id = :preguntaid', { preguntaid: preguntaid })
      .andWhere('curso.user = :user', { user: user.id })
      .getOne();

    if (!questionFound) {
      throw new NotFoundException('Question does not exist');
    }
    await this._preguntahtmlRepository.delete(questionFound);
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
  async getAllByIdClaseStudent(
    idclase: string,
    user: User,
  ): Promise<PreguntaEstundentReadHtmlDto[]> {
    const preguntafound: PreguntaHtml[] = await this._preguntahtmlRepository
      .createQueryBuilder('pregunta')
      .innerJoin('pregunta.actividad', 'actividad')
      .innerJoin('actividad.clase', 'clase')
      .innerJoin('clase.modulo', 'modulo')
      .innerJoin('modulo.curso', 'curso')
      .innerJoin('curso.cursosprogreso', 'cursosprogreso')
      .where('clase.id = :idclase', { idclase: idclase })
      .andWhere('cursosprogreso.user = :user', { user: user.id })
      .getMany();
     
    return preguntafound.map((pregunta) =>
      plainToClass(PreguntaEstundentReadHtmlDto, pregunta),
    );
  }
}
