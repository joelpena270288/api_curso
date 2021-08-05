import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
 
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinTable,
} from 'typeorm';
import { Curso } from '../curso/curso.entity';

import { Nota } from '../nota/nota.entity';

import { ModulosPasados } from '../modulos-pasados/modulos-pasados.entity';
import { ModuloActual } from '../modulo-actual/modulo-actual.entity';
import { User } from '../user/user.entity';
import {ClasesFaltantes} from '../clases-faltantes/clases-faltantes.entity';
@Entity('cursos-progreso')
export class CursosProgreso extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ManyToOne(() => User, (user) => user.cursosProgreso)
  user: User;
  @ManyToMany(() => Nota, { eager: true })
  notas: Nota[];
  @ManyToOne(() => Curso, (curso) => curso.cursosprogreso, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  curso: Curso;
  @OneToMany(
    () => ModulosPasados,
    (modulospasados) => modulospasados.cursoProgreso,
  )
  @JoinTable()
  modulospasados: ModulosPasados[];

  @OneToOne(() => ModuloActual, (moduloactual) => moduloactual.cursoprogress)
  @JoinColumn()
  moduloActual: ModuloActual;

 

 


  
}
