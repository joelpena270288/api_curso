import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { status } from '../../shared/entity-status.enum';
import { plainToClass } from 'class-transformer';
import { ModuloRepository } from './modulo.repository';
import { Modulo } from './modulo.entity';
import { CursoRepository } from '../curso/curso.repository';
import { Curso } from '../curso/curso.entity';
import { User } from '../user/user.entity';
import { ExamenModuloRepository } from '../examen-modulo/examen-modulo.repository';
import { ExamenModulo } from '../examen-modulo/examen-modulo.entity';
import { createModuloDto } from './dto/create.dto';

@Injectable()
export class ModuloService {
  constructor(
    @InjectRepository(ModuloRepository)
    private readonly _moduloRepository: ModuloRepository,
    @InjectRepository(CursoRepository)
    private readonly _cursoRepository: CursoRepository,
    @InjectRepository(ExamenModuloRepository)
    private readonly _examenModuloRepository: ExamenModuloRepository,
  ) {}
  async create(modulo: createModuloDto, user: User): Promise<Modulo> {
    const curso: Curso = await this.validarUsuario(modulo.idcurso, user);
    const nuevoModulo = new Modulo();
    nuevoModulo.nombre = modulo.nombre;
    nuevoModulo.descripcion = modulo.descripcion;
    nuevoModulo.nota = modulo.nota;
    nuevoModulo.numeromodulo = modulo.numeromodulo;
    nuevoModulo.status = 'ACTIVE';
    nuevoModulo.curso = curso;
    const moduloSaved = await this._moduloRepository.save(nuevoModulo);
    const examen = new ExamenModulo();
    examen.modulo = moduloSaved;
    await this._examenModuloRepository.save(examen);
    return moduloSaved;

  }

  async get(moduloid: string, user: User): Promise<Modulo> {
    if (!moduloid) {
      throw new BadRequestException('id must be sent');
    }
    const modulo: Modulo = await this._moduloRepository
      .createQueryBuilder('modulo')
      .innerJoin('modulo.curso', 'curso')      
      .where('modulo.id = :id', { id: moduloid })
      .andWhere('curso.user = :user', { user: user.id })
      .getOne();
    if (!modulo) {
      throw new NotFoundException('You dont have permission');
    }
    return modulo;
  }
  async getAll(): Promise<Modulo[]> {
    const modulo: Modulo[] = await this._moduloRepository.find({
      where: { status: status.ACTIVE },
    });
    return modulo;
  }
  async getAllByIdCurso(cursoid: string, user: User): Promise<Modulo[]> {
    let modulo;
    try {
      modulo = await this._moduloRepository
        .createQueryBuilder('modulo')
        .addOrderBy('modulo.numeromodulo')
        .innerJoin('modulo.curso', 'curso')       
        .where('curso.id = :id', { id: cursoid })
        .andWhere('curso.user = :user', { user: user.id })
        .getMany();
    } catch (e) {
      console.log(e);
    }
    return modulo;
  }

  async update(modulo: Modulo, user: User): Promise<Modulo> {
    const foundmodulo = await this._moduloRepository
      .createQueryBuilder('modulo')
      .innerJoin('modulo.curso', 'curso')
     
      .where('modulo.id = :idmodulo', { idmodulo: modulo.id })
      .andWhere('curso.user = :user', { user: user.id })
      .getOne();
    if (!foundmodulo) {
      throw new NotFoundException('You dont have permission');
    }
    foundmodulo.nombre = modulo.nombre;
    foundmodulo.nota = modulo.nota;
    foundmodulo.descripcion = modulo.descripcion;
    foundmodulo.numeromodulo = modulo.numeromodulo;

    return await this._moduloRepository.save(foundmodulo);
  }
  async delete(moduloId: string, user: User): Promise<Modulo> {
    const foundmodulo = await this._moduloRepository
      .createQueryBuilder('modulo')
      .leftJoinAndSelect('modulo.curso', 'curso')
    
      .where('modulo.id = :idmodulo', { idmodulo: moduloId })
      .andWhere('curso.user = :user', { user: user.id })
      .getOne();

    if (!foundmodulo) {
      throw new NotFoundException('Module does not exist');
    }
    await this._moduloRepository.delete(foundmodulo);
    return foundmodulo;
  }
  async validarUsuario(idcurso: string, user: User): Promise<Curso> {
    const curso: Curso = await this._cursoRepository
      .createQueryBuilder('curso')      
      .where('curso.id = :idcurso', { idcurso: idcurso })
      .andWhere('curso.user = :user', { user: user.id })
      .getOne();
    if (!curso) {
      throw new BadRequestException('You dont have permission');
    }
    return curso;
  }
}
