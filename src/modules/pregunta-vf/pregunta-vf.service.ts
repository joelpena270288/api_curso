import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PreguntaVfRepository } from './pregunta-vf.repository';
import { PreguntaVf } from './pregunta-vf.entity';
import { PreguntaValueVoFRepository } from '../preguntas-valueVoF/pregunta-valueVoF.repository';
import { PreguntaValueVoF } from '../preguntas-valueVoF/pregunta-valueVoF.entity';
import { CursoRepository } from '../curso/curso.repository';
import { ModuloRepository } from '../modulo/modulo.repository';
import { ExamenModuloRepository } from '../examen-modulo/examen-modulo.repository';
import { User } from '../user/user.entity';



@Injectable()
export class PreguntaVfService {
  constructor(
    private readonly _preguntaVfRepository: PreguntaVfRepository,
    private readonly _preguntaValueVoFRepository: PreguntaValueVoFRepository,
    private readonly _cursoRepository: CursoRepository,
    private readonly _moduloRepository: ModuloRepository,
    private readonly _examenModuloRepository: ExamenModuloRepository,
   
  ) {}

  async create( user: User){
  
  }
}
