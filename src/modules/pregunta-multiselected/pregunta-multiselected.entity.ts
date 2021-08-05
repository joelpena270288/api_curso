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
import { Pregunta } from '../preguntas/pregunta.entity';
import { ExamenModulo } from '../examen-modulo/examen-modulo.entity';
@Entity('preguntas-multiselected')
export class PreguntaMultiselected extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ nullable: true })
  enunciado: string;
  @Column({ nullable: true })
  respuestas: string;
  @OneToMany((type) => Pregunta, (pregunta) => pregunta.preguntaMultiselected)
  preguntas: Pregunta[];

  @ManyToOne(
    () => ExamenModulo,
    (examenModulo) => examenModulo.preguntaMultiselected,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  examenModulo: ExamenModulo;
}
