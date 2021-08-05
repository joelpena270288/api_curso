import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DocumentoRepository } from './documento.repository';
import { Documento } from './documento.entity';
import { User } from '../user/user.entity';
import { createDocumentDto } from './dto/create.dto';
import { ActividadRepository } from '../actividad/actividad.repository';
import { Actividad } from '../actividad/actividad.entity';

@Injectable()
export class DocumentoService {
  constructor(
    @InjectRepository(DocumentoRepository)
    private readonly _documentoRepository: DocumentoRepository,
    private readonly _actividadRepository: ActividadRepository,
  ) {}
  async create(
    document: createDocumentDto,
    user: User,
    idactividad: string,
  ): Promise<Documento> {
    const actividada: Actividad = await this.validarUsuario(idactividad, user);
    const doc: Documento = new Documento();
    doc.nombre = document.nombre;
    doc.actividad = actividada;
    doc.link = document.link;
    const savedDocumento: Documento = await this._documentoRepository.save(doc);
    return savedDocumento;
  }
  async getAllByIdClase(actividadid: string): Promise<Documento[]> {
    const documento: Documento[] = await this._documentoRepository.find({
      where: { actividad: actividadid },
    });
    return documento;
  }
  async update(
    iddocumento: string,
    documento: Documento,
    user: User,
  ): Promise<boolean> {
    const documentofound = await this._documentoRepository
      .createQueryBuilder('documento')
      .innerJoin('documento.actividad', 'actividad')
      .innerJoin('actividad.clase', 'clase')
      .innerJoin('clase.modulo', 'modulo')
      .innerJoin('modulo.curso', 'curso')
     
      .where('documento.id = :iddocumento', { iddocumento: iddocumento })
      .andWhere('curso.user = :user', { user: user.id })
      .getOne();
    if (!documentofound) {
      throw new NotFoundException('this Document does not found');
    }
    documentofound.nombre = documento.nombre;
    documentofound.link = documento.link;
    documentofound.updatedAt = new Date();

    let saveddocumento;
    try {
      saveddocumento = await this._documentoRepository.save(documentofound);
    } catch (e) {
      console.log(e);
    }
    if (!saveddocumento) {
      throw new NotFoundException('Dont was saved document');
    }
    return true;
  }
  async delete(documentoid: string, user: User): Promise<boolean> {
    const documentoFound = await this._documentoRepository
      .createQueryBuilder('documento')
      .innerJoin('documento.actividad', 'actividad')
      .innerJoin('actividad.clase', 'clase')
      .innerJoin('clase.modulo', 'modulo')
      .innerJoin('modulo.curso', 'curso')
      
      .where('documento.id = :documentoid', { documentoid: documentoid })
      .andWhere('curso.user = :user', { user: user.id })
      .getOne();

    if (!documentoFound) {
      throw new NotFoundException('Document does not exist');
    }
    await this._documentoRepository.delete(documentoFound);
    return true;
  }
  async validarUsuario(idactividad: string, user: User): Promise<Actividad> {
    const actividad = await this._actividadRepository
      .createQueryBuilder('actividad')
      .innerJoin('actividad.clase', 'clase')
      .innerJoin('clase.modulo', 'modulo')
      .innerJoin('modulo.curso', 'curso')
      
      .where('actividad.id = :idactividad', { idactividad: idactividad })
      .andWhere('curso.user = :user', { user: user.id })
      .getOne();
    if (!actividad) {
      throw new BadRequestException(
        'you dont have permission for this activity',
      );
    }
    return actividad;
  }
}
