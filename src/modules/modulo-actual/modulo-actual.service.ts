import {
    BadRequestException,
    Injectable,
    NotFoundException,
    
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import {ModuloActualRepository} from './modulo-actual.repository';
  import { status } from '../../shared/entity-status.enum';
  import {ModuloActual} from './modulo-actual.entity';
  import { User } from '../user/user.entity';

@Injectable()
export class ModuloActualService {
    constructor(
          @InjectRepository(ModuloActualRepository)
    private readonly _moduloActualRepository: ModuloActualRepository,
){}
    async getByIdProgress(idprogress: string, user: User): Promise<ModuloActual> {
        const moduloActual: ModuloActual = await this._moduloActualRepository
          .createQueryBuilder('moduloactual')
          .leftJoinAndSelect('moduloactual.modulo', 'modulo')
          .innerJoin('moduloactual.cursoprogress', 'cursoprogress')
          .where('cursoprogress.id = :idprogress', { idprogress: idprogress })         
          .andWhere('cursoprogress.user = :user', { user: user.id })
          .getOne();
        return moduloActual;
      }
}
