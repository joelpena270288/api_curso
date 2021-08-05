import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Modulo } from '../modulo/modulo.entity';

import { CursosProgreso } from '../cursos-progreso/cursos-progreso.entity';
import { CursosPasados } from '../cursos-pasados/cursos-pasados.entity';
import { User } from '../user/user.entity';


@Entity('cursos')
export class Curso extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  nombre: string;
  @Column()
  nota: number;
  @Column()
  precio: number;
  @Column()
  descripcion: string;
  @Column()
  fecha_inicio_incripcion: Date;
  @Column()
  fecha_fin_incripcion: Date;
  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;
  @CreateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
  @Column({ type: 'varchar', default: 'ACTIVE', length: 12 })
  status: string;
  @Column({ default: false })
  disponible: boolean;
  @OneToMany((type) => Modulo, (modulo) => modulo.curso)
  modulos: Modulo[];
  @ManyToOne(() => User, (user) => user.cursos)
  user: User;
  @OneToMany(() => CursosProgreso, (cursoprogreso) => cursoprogreso.curso)
  @JoinTable()
  cursosprogreso: CursosProgreso[];
  @OneToMany(() => CursosPasados, (cursopasado) => cursopasado.curso)
  @JoinTable()
  cursospasados: CursosPasados[];
}
