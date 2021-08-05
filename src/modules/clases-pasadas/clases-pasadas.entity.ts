import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToOne,
} from 'typeorm';
import { ModuloActual } from '../modulo-actual/modulo-actual.entity';
import { ModulosPasados } from '../modulos-pasados/modulos-pasados.entity';
import { Clase } from '../clase/clase.entity';
@Entity('clases-pasadas')
export class ClasePasada extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @OneToOne(() => ModuloActual, (moduloActual) => moduloActual.clasespasadas, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  moduloActual: ModuloActual;

  @Column({ default: 0, type: 'decimal' })
  nota: number;
  @ManyToMany(() => Clase)
  @JoinTable()
  clases: Clase[];
}
