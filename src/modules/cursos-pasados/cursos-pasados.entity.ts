import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Curso } from '../curso/curso.entity';

import { Nota } from '../nota/nota.entity';
import { User } from '../user/user.entity';
@Entity('cursos-pasados')
export class CursosPasados extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ManyToOne(() => User, (user) => user.cursosProgreso, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  user: User;
  @ManyToMany(() => Nota, { eager: true })
  notas: Nota[];
  @ManyToOne(() => Curso, (curso) => curso.cursospasados)
  curso: Curso;
}
