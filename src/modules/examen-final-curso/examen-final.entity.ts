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
import { Modulo } from '../modulo/modulo.entity';

import { PreguntaChecked } from '../pregunta-cheked/pregunta-checked.entity';

import { PreguntaMultiselected } from '../pregunta-multiselected/pregunta-multiselected.entity';
import { PreguntaVf } from '../pregunta-vf/pregunta-vf.entity';

import {Curso } from '../curso/curso.entity';
@Entity('examen-final')
export class ExamenFinal extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

 

  @OneToOne(() => Curso)
  @JoinColumn()
  curso: Curso;
}
