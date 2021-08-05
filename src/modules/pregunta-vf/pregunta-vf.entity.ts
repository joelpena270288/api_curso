import {
  BaseEntity,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
} from 'typeorm';
import { PreguntaValueVoF } from '../preguntas-valueVoF/pregunta-valueVoF.entity';
import { ExamenModulo } from '../examen-modulo/examen-modulo.entity';

@Entity('preguntas-vf')
export class PreguntaVf extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @OneToMany(
    () => PreguntaValueVoF,
    (preguntaValue) => preguntaValue.preguntavf,
  )
  preguntasValue: PreguntaValueVoF[];
  @ManyToOne(
    () => ExamenModulo,
    (examenModulo) => examenModulo.preguntaVf,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  examenModulo: ExamenModulo;

 
}
