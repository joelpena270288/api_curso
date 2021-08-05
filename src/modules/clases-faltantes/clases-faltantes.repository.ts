import { EntityRepository, Repository } from 'typeorm';
import { ClasesFaltantes } from './clases-faltantes.entity';
@EntityRepository(ClasesFaltantes)
export class ClasesFaltantesRepository extends Repository<ClasesFaltantes> {}