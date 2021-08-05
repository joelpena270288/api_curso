import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  ManyToMany,
  PrimaryGeneratedColumn,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { User } from '../user/user.entity';
@Entity('planes')
export class Plan extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  nombre: string;
  @Column()
  descripcion: string;
  @Column({ default: 1 })
  cantidadCursos: number;
  @Column({ type: 'decimal', default: 0 })
  precio: number;
  @Column({ default: 'ACTIVE' })
  status: string;
  @ManyToMany((type) => User, (user) => user.planes)
  @JoinColumn()
  users: User[];
  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;
  @CreateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
