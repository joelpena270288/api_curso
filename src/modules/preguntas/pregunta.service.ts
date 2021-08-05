import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../user/user.entity';
import { PreguntaRepository } from './pregunta.repository';
import { Pregunta } from './pregunta.entity';
import { ModuloRepository } from '../modulo/modulo.repository';

@Injectable()
export class PreguntaService {
  constructor(
    private readonly _preguntaRepository: PreguntaRepository,  
    private readonly _moduloRepository: ModuloRepository,
  ) {}
  
 
}
