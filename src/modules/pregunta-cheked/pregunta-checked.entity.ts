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

@Entity('preguntas-checked')
export class PreguntaChecked extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
   
  @Column({ nullable: true })
  enunciado: string;
  @Column({ nullable: false })
  pregunta_correcta: string;

  @OneToMany((type) => Pregunta, (pregunta) => pregunta.preguntaChecked)
  preguntas: Pregunta[];

  @ManyToOne(
    () => ExamenModulo,
    (examenModulo) => examenModulo.preguntaChecked,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  examenModulo: ExamenModulo;
  @CreateDateColumn({ type: 'timestamp', name: 'created_at', nullable: true })
  createdAt: Date;
  @CreateDateColumn({ type: 'timestamp', name: 'updated_at', nullable: true })
  updatedAt: Date;
}
