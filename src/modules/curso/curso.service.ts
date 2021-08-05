import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { status } from '../../shared/entity-status.enum';
import { plainToClass } from 'class-transformer';
import { CursoRepository } from './curso.repository';
import { Curso } from './curso.entity';
import { User } from '../user/user.entity';
import { UserRepository } from '../user/user.repository';
import { PlanRepository } from '../plan/plan.repository';

@Injectable()
export class CursoService {
  constructor(
    @InjectRepository(CursoRepository)
    private readonly _cursoRepository: CursoRepository,
    @InjectRepository(UserRepository)
    private readonly _userRepository: UserRepository,
    @InjectRepository(PlanRepository)
    private readonly _planRepository: PlanRepository,
  ) {}
  async getAll(): Promise<Curso[]> {
    const cursofound: Curso[] = await this._cursoRepository
      .createQueryBuilder('curso')
      .where('curso.status = :status', { status: status.ACTIVE })
      .andWhere('curso.disponible = :disponible', { disponible: true })
      .getMany();
    return cursofound;
  }
  async create(curso: Curso, user: User): Promise<Curso> {
    if (!(await this.ValidarPlan(user))) {
      throw new BadRequestException(
        'Your plan does not allow you to add more courses, request another plan.',
      );
    }
   
    const newcurso: Curso = new Curso();
    newcurso.nombre = curso.nombre;
    newcurso.nota = curso.nota;
    newcurso.precio = curso.precio;
    newcurso.descripcion = curso.descripcion;
    newcurso.fecha_inicio_incripcion = curso.fecha_inicio_incripcion;
    newcurso.fecha_fin_incripcion = curso.fecha_fin_incripcion;
    newcurso.user = user;
    const savedCurso: Curso = await this._cursoRepository.save(newcurso);
    return savedCurso;
  }
  async estado(idcurso: string, disponible: boolean, user: User): Promise<Curso> {
  
    const cursofound: Curso = await this._cursoRepository
    .createQueryBuilder('curso')
    .where('curso.id = :idcurso', { idcurso: idcurso })
    .andWhere('curso.status = :status', { status: status.ACTIVE })
    .andWhere('curso.user = :userid', { userid: user.id })
    .getOne();
    cursofound.disponible = disponible;
    const savedCurso: Curso = await this._cursoRepository.save(cursofound);
    return savedCurso;
  }


  async getAllByUser(user: User): Promise<Curso[]> {
    const cursofound: Curso[] = await this._cursoRepository
      .createQueryBuilder('curso')
      .where('curso.status = :status', { status: status.ACTIVE })
      .andWhere('curso.user = :userid', { userid: user.id })
      .getMany();
    return cursofound;
  }
  async getById(idcurso: string, user: User): Promise<Curso> {
    const cursofound: Curso = await this._cursoRepository
      .createQueryBuilder('curso')
      .where('curso.status = :status', { status: status.ACTIVE })
      .andWhere('curso.user = :userid', { userid: user.id })
      .andWhere('curso.id = :idcurso', { idcurso: idcurso })
      .getOne();
    if (!cursofound) {
      throw new NotFoundException('this course not exist for this user');
    }
    return cursofound;
  }

  async getDetail(idcurso: string): Promise<Curso> {
    const cursofound: Curso = await this._cursoRepository
      .createQueryBuilder('curso')
      .where('curso.status = :status', { status: status.ACTIVE })
      .andWhere('curso.disponible = :disponible', { disponible: true })
      .andWhere('curso.id = :idcurso', { idcurso: idcurso })
      .getOne();
    if (!cursofound) {
      throw new NotFoundException('this course not exist for this user');
    }
    return cursofound;
  }
  async ValidarPlan(user: User): Promise<boolean> {
    const cantCursos = await this._cursoRepository
      .createQueryBuilder('curso')
      .where('curso.status = :status', { status: status.ACTIVE })
      .andWhere('curso.user = :user', { user: user.id })
      .getCount();

    const plan = await this._planRepository
      .createQueryBuilder('plan')
      .leftJoinAndSelect("plan.users", "user")
      .where('user.id = :user', { user: user.id })
     
      .andWhere('plan.cantidadCursos > :cantCursos', { cantCursos: cantCursos })
      .getCount();

    if (plan > 0) {
      return true;
    }
    return false;
  }
}
