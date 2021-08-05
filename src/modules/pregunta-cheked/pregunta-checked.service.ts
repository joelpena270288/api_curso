import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { PreguntaCheckedRepository } from './pregunta-checked.repository';
import { PreguntaChecked } from './pregunta-checked.entity';
import { User } from '../user/user.entity';
import { ModuloRepository } from '../modulo/modulo.repository';
import { createCheckedDto } from './dto/create.dto';
import { Modulo } from '../modulo/modulo.entity';
import { PreguntaRepository } from '../preguntas/pregunta.repository';
import { Pregunta } from '../preguntas/pregunta.entity';
@Injectable()
export class PreguntaCheckedService {
  constructor(
    private readonly _preguntaCheckedRepository: PreguntaCheckedRepository,
    private readonly _moduloRepository: ModuloRepository,
    private readonly _preguntaRepository: PreguntaRepository,
  ) {}

  async create(
    idmodulo: string,
    preguntaChecked: createCheckedDto,
    user: User,
  ): Promise<PreguntaChecked> {
    const modulo = await this.ValidarUsuario(idmodulo, user);
    const preguntaCheck = new PreguntaChecked();
    preguntaCheck.pregunta_correcta = preguntaChecked.pregunta_correcta;
    preguntaCheck.examenModulo = modulo.examen;
    preguntaCheck.enunciado = preguntaChecked.enunciado;
    const preguntaCheckSaved = await this._preguntaCheckedRepository.save(
      preguntaCheck,
    );
    for (let index = 0; index < preguntaChecked.preguntas.length; index++) {
      const pregunta = new Pregunta();
      pregunta.pregunta = preguntaChecked.preguntas[index].name;
      pregunta.preguntaChecked = preguntaCheckSaved;
      await this._preguntaRepository.save(pregunta);
    }
    return preguntaCheckSaved;
  }
  async getAllByIdModulo(
    idmodulo: string,
    user: User,
  ): Promise<PreguntaChecked[]> {
    let preguntas: PreguntaChecked[];
    try {
      preguntas = await this._preguntaCheckedRepository
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
}
