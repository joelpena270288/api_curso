import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { ModuloActual } from '../modulo-actual/modulo-actual.entity';
import { ModulosPasados } from '../modulos-pasados/modulos-pasados.entity';
import { CursosProgreso } from '../cursos-progreso/cursos-progreso.entity';
import { Clase } from '../clase/clase.entity';
@Entity('clases-faltantes')
export class ClasesFaltantes extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @OneToOne(
    () => ModuloActual,
    (moduloActual) => moduloActual.clasesfaltantes,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  moduloActual: ModuloActual;

  @Column({ default: 0, type: 'decimal' })
  nota: number;
  @ManyToMany(() => Clase)
  @JoinTable()
  clases: Clase[];
}
