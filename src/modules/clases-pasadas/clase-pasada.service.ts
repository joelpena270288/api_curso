
import {
    BadRequestException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { User } from '../user/user.entity';
  import { InjectRepository } from '@nestjs/typeorm';
  import { ClasePasada } from './clases-pasadas.entity';
  import { ClasePasadaRepository } from './clase-pasada.repository';
@Injectable()
export class ClasePasadaService {
    constructor(
        @InjectRepository(ClasePasadaRepository)
        private readonly _clasePasadaRepository: ClasePasadaRepository,
      ) {}
      async getAllByIdProgress(
        idprogress: string,
        user: User,
      ): Promise<ClasePasada> {
        if (!idprogress) {
          throw new BadRequestException('id must be sent');
        }
        const pasadas: ClasePasada = await this._clasePasadaRepository
          .createQueryBuilder('pasadas')
          .innerJoin('pasadas.moduloActual', 'moduloActual')
          .leftJoinAndSelect('pasadas.clases', 'clases')
          .addOrderBy('clases.numeroclase')
          .innerJoin('moduloActual.cursoprogress', 'cursoprogress')
          .where('cursoprogress.id = :idprogress', { idprogress: idprogress })
          .andWhere('cursoprogress.user = :user', { user: user.id })
          .getOne();
        return pasadas;
      }
}
