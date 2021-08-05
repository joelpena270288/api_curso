import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { status } from '../../shared/entity-status.enum';
import { plainToClass } from 'class-transformer';
import { ModuloRepository } from '../modulo/modulo.repository';
import { User } from '../user/user.entity';
import {ExamenModuloRepository} from './examen-modulo.repository';

@Injectable()
export class ExamenModuloService {
  constructor(
    private readonly _examenModuloRepository: ExamenModuloRepository,
    private readonly _moduloRepository: ModuloRepository,
   
  
  ) {}
 
 
 
  
 

 
}
