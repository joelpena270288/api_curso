import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PreguntaChecked } from '../pregunta-cheked/pregunta-checked.entity';

import { PreguntaMultiselected } from '../pregunta-multiselected/pregunta-multiselected.entity';
import { PreguntaVf } from '../pregunta-vf/pregunta-vf.entity';


import { Modulo } from '../modulo/modulo.entity';
@Entity('examen-modulo')
export class ExamenModulo extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(
    (type) => PreguntaChecked,
    (preguntaChecked) => preguntaChecked.examenModulo)
    preguntaChecked: PreguntaChecked[];

  @OneToMany(
    (type) => PreguntaMultiselected,
    (preguntaMultiselected) => preguntaMultiselected.examenModulo,  )
    preguntaMultiselected: PreguntaMultiselected[];

    @OneToMany(
      (type) => PreguntaVf,
      (preguntaVf) => preguntaVf.examenModulo,  )
      preguntaVf: PreguntaVf[];
  

 
  @OneToOne(() => Modulo, (modulo) => modulo.examen)
  modulo: Modulo;
}
