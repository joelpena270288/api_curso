import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClaseRepository } from './clase.repository';
import { ModuloRepository } from '../modulo/modulo.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Clase } from './clase.entity';
import { Modulo } from '../modulo/modulo.entity';
import { status } from '../../shared/entity-status.enum';
import { User } from '../user/user.entity';
import { createClaseDto } from './dto/create.dto';

@Injectable()
export class ClaseService {
  constructor(
    @InjectRepository(ClaseRepository)
    private readonly _claseRepository: ClaseRepository,
    @InjectRepository(ModuloRepository)
    private readonly _moduloRepository: ModuloRepository,
  ) {}
  async create(clase: createClaseDto, user: User): Promise<Clase> {

      const foundModulo = await this.validarUsuario(clase.idmodulo, user);
      const nuevaclase = new Clase();
      nuevaclase.nombre = clase.nombre;
      nuevaclase.descripcion = clase.descripcion;
      nuevaclase.nota = clase.nota;
      nuevaclase.numeroclase = clase.numeroclase;
      nuevaclase.fecha_inicio = clase.fecha_inicio;     
      nuevaclase.modulo = foundModulo;
      
      
    
    return await this._claseRepository.save(nuevaclase);
  }
  async get(claseid: string, user: User): Promise<Clase> {
    if (!claseid) {
      throw new BadRequestException('id must be sent');
    }
    const clase: Clase = await this._claseRepository
    .createQueryBuilder('clase')
    .innerJoin('clase.modulo', 'modulo')
    .innerJoin('modulo.curso', 'curso')
   
    .where('clase.id = :claseid', { claseid: claseid })
    .andWhere('curso.user = :user', { user: user.id })   
    .getOne();

    
    if (!clase) {
      throw new NotFoundException('this module does not found');
    }
    return clase;
  }
  async getAll(): Promise<any> {
    return await this._claseRepository.find({ relations: ['actividades'] });
  }

  async update(
  
    clase: Clase,
    user: User,
  ): Promise<Clase> {
    let claseresult;
    try {
      claseresult = await this._claseRepository
        .createQueryBuilder('clase')
        .innerJoin('clase.modulo', 'modulo')
        .innerJoin('modulo.curso', 'curso')
       
        .where('clase.id = :id', { id: clase.id })
        .andWhere('curso.user = :user', { user: user.id })
        .addOrderBy('clase.numeroclase')
        .getOne();
    } catch (e) {
      throw new NotFoundException('Error in ');
    }
    if (!claseresult) {
      throw new NotFoundException('this lesson does not found');
    }
    claseresult.nombre = clase.nombre;
    claseresult.descripcion= clase.descripcion;
    claseresult.nota = clase.nota;
    claseresult.numeroclase = clase.numeroclase;
    claseresult.fecha_inicio = clase.fecha_inicio;

    claseresult.save();
    return claseresult;
  }
  async delete(claseId: string, user: User): Promise<Clase> {
    const claseFound = await this._claseRepository
      .createQueryBuilder('clase')
      .leftJoinAndSelect('clase.modulo', 'modulo')
      .innerJoin('modulo.curso', 'curso')
      
      .where('clase.id = :claseid', { claseid: claseId })
      .andWhere('curso.user = :user', { user: user.id })
      .getOne();

    if (!claseFound) {
      throw new NotFoundException('Clase does not exist');
    }
    await this._claseRepository.delete(claseFound);
    return claseFound;
  }
  async getAllByIdModulo(moduloid: string, user: User): Promise<Clase[]> {
    const clase: Clase[] = await this._claseRepository
      .createQueryBuilder('clase')
      .addOrderBy('clase.numeroclase')
      .leftJoinAndSelect('clase.actividades', 'actividades')
      .innerJoin('clase.modulo', 'modulo')
      .innerJoin('modulo.curso', 'curso')
     
      .where('modulo.id = :id', { id: moduloid })
      .andWhere('curso.user = :user', { user: user.id })
      .getMany();
    return clase;
  }
  async validarUsuario(idmodulo: string, user: User):Promise<Modulo>{
   const modulo: Modulo = await this._moduloRepository
    .createQueryBuilder('modulo')   
    .innerJoin('modulo.curso', 'curso')
    .where('modulo.id = :id', { id: idmodulo})
    .andWhere('curso.user = :user', { user: user.id })
    .getOne();
    if(!modulo){
      throw new BadRequestException("You dont have permission");
    }
    return modulo;
  }
}
