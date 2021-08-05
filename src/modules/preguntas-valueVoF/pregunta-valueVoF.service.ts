import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PreguntaValueVoFRepository } from './pregunta-valueVoF.repository';
import { PreguntaValueVoF } from './pregunta-valueVoF.entity';
import { PreguntaVfRepository } from '../pregunta-vf/pregunta-vf.repository';
import { PreguntaMultiselected } from '../pregunta-multiselected/pregunta-multiselected.entity';
import { PreguntaMultiselectedRepository } from '../pregunta-multiselected/pregunta-multiselected.repository';
import { User } from '../user/user.entity';
import { ModuloRepository } from '../modulo/modulo.repository';

@Injectable()
export class PreguntaValueService {
  constructor(
    private readonly _preguntaValueVoFRepository: PreguntaValueVoFRepository,
    private readonly _preguntaVFRepository: PreguntaVfRepository,   
    private readonly _moduloRepository: ModuloRepository,
    private readonly _preguntaMultiselectedRepository: PreguntaMultiselectedRepository,
  ) {}


}
