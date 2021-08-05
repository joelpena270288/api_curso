import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { User } from '../user/user.entity';
import { PreguntaMultiselectedRepository } from './pregunta-multiselected.repository';
import { PreguntaMultiselected } from './pregunta-multiselected.entity';
import { createMultiDto } from './dto/create.dto';

import { Pregunta } from '../preguntas/pregunta.entity';
import { PreguntaRepository } from '../preguntas/pregunta.repository';
import { Modulo } from '../modulo/modulo.entity';


import { ModuloRepository } from '../modulo/modulo.repository';
@Injectable()
export class PreguntaMultiselectedService {
  constructor(
    private readonly _preguntaMultiselectedRepository: PreguntaMultiselectedRepository,
    private readonly _preguntaRepository: PreguntaRepository,
    private readonly _moduloRepository: ModuloRepository,
  ) {}
  async create(
    idmodulo: string,
    preguntaMulti: createMultiDto,
    user: User,
  ): Promise<PreguntaMultiselected> {
    const modulo = await this.ValidarUsuario(idmodulo, user);
    const preguntaMult = new PreguntaMultiselected();
   
    preguntaMult.examenModulo = modulo.examen;
    preguntaMult.enunciado = preguntaMulti.enunciado;
    preguntaMult.respuestas = preguntaMulti.respuestas;
    const preguntaMultiSaved = await this._preguntaMultiselectedRepository.save(
      preguntaMult,
    );
    for (let index = 0; index < preguntaMulti.preguntas.length; index++) {
      const pregunta = new Pregunta();
      pregunta.pregunta = preguntaMulti.preguntas[index].name;
      pregunta.preguntaMultiselected = preguntaMultiSaved;
      await this._preguntaRepository.save(pregunta);
    }
    return preguntaMultiSaved;
  }
  async ValidarUsuario(idmodulo: string, user: User): Promise<Modulo> {
    const modulo = await this._moduloRepository
      .createQueryBuilder('modulo')
      .innerJoin('modulo.curso', 'curso')
      .leftJoinAndSelect('modulo.examen', 'examen')
      .innerJoin('curso.dashboard', 'dashboard')
      .where('modulo.id = :id', { id: idmodulo })
      .andWhere('dashboard.user = :user', { user: user.id })
      .getOne();
    if (!modulo) {
      throw new BadRequestException('You dont have permission');
    }
    return modulo;
  }
  async getAllByIdModulo(
    idmodulo: string,
    user: User,
  ): Promise<PreguntaMultiselected[]> {
    let preguntas: PreguntaMultiselected[];
    try {
      preguntas = await this._preguntaMultiselectedRepository
        .createQueryBuilder('pregunta')
        .innerJoin('pregunta.examenModulo', 'examenModulo')
        .leftJoinAndSelect('pregunta.preguntas', 'preguntas')
        .innerJoin('examenModulo.modulo', 'modulo')
        .innerJoin('modulo.curso', 'curso')
        .leftJoinAndSelect('modulo.examen', 'examen')
        .innerJoin('curso.dashboard', 'dashboard')
        .where('modulo.id = :id', { id: idmodulo })
        .andWhere('dashboard.user = :user', { user: user.id })
        .getMany();
    } catch (e) {
      throw new BadRequestException(e);
    }
    return preguntas;
  }
 
}
