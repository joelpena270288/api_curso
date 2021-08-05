import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  CreateDateColumn,
  OneToMany,
  ManyToOne
} from 'typeorm';

import { Role } from '../role/role.entity';
import { UserDetails } from './user.details.entity';

import { Nota } from '../nota/nota.entity';

import { CursosPasados } from '../cursos-pasados/cursos-pasados.entity';
import { CursosProgreso } from '../cursos-progreso/cursos-progreso.entity';
import { Curso } from '../curso/curso.entity';
import { Plan } from '../plan/plan.entity';
@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true, length: 25, nullable: false })
  username: string;

  @Column({ type: 'varchar', nullable: false })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;
  @OneToOne((type) => UserDetails, {
    cascade: true,
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'detail_id' })
  details: UserDetails;
  
  @Column({ type: 'varchar', length: 4 })
  codigo: string;
  @ManyToMany((type) => Role, (role) => role.users, { eager: true })
  @JoinTable({ name: 'user_roles' })
  roles: Role[];
  @OneToMany(() => Curso, (curso) => curso.user)
  cursos: Curso[];
  @OneToMany(() => CursosProgreso, (cursoProgreso) => cursoProgreso.user)
  cursosProgreso: CursosProgreso[];
  @OneToMany(() => CursosPasados, (cursoPasado) => cursoPasado.user)
  cursosPasados: CursosPasados[];
  @ManyToMany(() => Plan, (plan) => plan.users)
  @JoinTable({ name: 'user_planes' })
  planes: Plan[];  
  @Column({ type: 'varchar', default: 'INACTIVE', length: 10 })
  status: string;
  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;
  @CreateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
