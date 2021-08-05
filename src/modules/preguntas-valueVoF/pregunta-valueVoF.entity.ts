import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PreguntaVf } from '../pregunta-vf/pregunta-vf.entity';
import { PreguntaMultiselected } from '../pregunta-multiselected/pregunta-multiselected.entity';

@Entity('preguntas-valueVoF')
export class PreguntaValueVoF extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  pregunta: string;
 
  @ManyToOne(() => PreguntaVf, (preguntaVf) => preguntaVf.preguntasValue, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  preguntavf: PreguntaVf;

 
}
