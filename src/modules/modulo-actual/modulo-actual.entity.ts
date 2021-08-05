import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Clase } from '../clase/clase.entity';
import { Modulo } from '../modulo/modulo.entity';
import { CursosProgreso } from '../cursos-progreso/cursos-progreso.entity';
import { ClasePasada } from '../clases-pasadas/clases-pasadas.entity';
import { ClasesFaltantes } from '../clases-faltantes/clases-faltantes.entity';
@Entity('modulosactual')
export class ModuloActual extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne((type) => Modulo, (modulo) => modulo.moduloactual, {
    cascade: true,
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  modulo: Modulo;
  @OneToOne(
    () => CursosProgreso,
    (cursoprogress) => cursoprogress.moduloActual,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  cursoprogress: CursosProgreso;

  @OneToOne(() => ClasePasada, (clasespasadas) => clasespasadas.moduloActual)
  @JoinColumn()
  clasespasadas: ClasePasada;

  @OneToOne(
    () => ClasesFaltantes,
    (clasesfaltantes) => clasesfaltantes.moduloActual,
  )
  @JoinColumn()
  clasesfaltantes: ClasesFaltantes;
}
