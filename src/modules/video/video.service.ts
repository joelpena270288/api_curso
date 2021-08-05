import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VideoRepository } from './video.repository';
import { Video } from './video.entity';
import { User } from '../user/user.entity';
import { createVideoDto } from './dto/create.dto';
import { ActividadRepository } from '../actividad/actividad.repository';
import { Actividad } from '../actividad/actividad.entity';


@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(VideoRepository)
    private readonly _videoRepository: VideoRepository,
    private readonly _actividadRepository: ActividadRepository,
  ) {}

  async create(
    video: createVideoDto,
    user: User,
    idactividad: string): Promise<Video> {

      const actividada: Actividad = await this.validarUsuario(idactividad, user);
      const vid: Video = new Video();
      vid.nombre = video.nombre;
      vid.actividad = actividada;
      vid.link = video.link;
    const savedVideo: Video = await this._videoRepository.save(vid);
    return savedVideo;
  }
  async getAllByIdClase(actividadid: string): Promise<Video[]> {
    const video: Video[] = await this._videoRepository.find({
      where: { actividad: actividadid },
    });
    return video;
  }

  async update(idvideo: string, video: Video, user: User): Promise<boolean> {
    const videofound = await this._videoRepository
      .createQueryBuilder('video')
      .innerJoin('video.actividad', 'actividad')
      .innerJoin('actividad.clase', 'clase')
      .innerJoin('clase.modulo', 'modulo')
      .innerJoin('modulo.curso', 'curso')      
      .where('video.id = :idvideo', { idvideo: idvideo })
      .andWhere('curso.user = :user', { user: user.id })
      .getOne();
    if (!videofound) {
      throw new NotFoundException('this Content does not found');
    }
    videofound.nombre = video.nombre;
    videofound.link = video.link;
    videofound.updatedAt = new Date();

    videofound.updatedAt = new Date();
    let savedcontenido;
    try {
      savedcontenido = await this._videoRepository.save(videofound);
    } catch (e) {
      console.log(e);
    }
    if (!savedcontenido) {
      throw new NotFoundException('Dont was saved video');
    }
    return true;
  }
  async delete(videoid: string, user: User): Promise<boolean> {
    const videoFound = await this._videoRepository
      .createQueryBuilder('video')
      .innerJoin('video.actividad', 'actividad')
      .innerJoin('actividad.clase', 'clase')
      .innerJoin('clase.modulo', 'modulo')
      .innerJoin('modulo.curso', 'curso')      
      .where('video.id = :videoid', { videoid: videoid })
      .andWhere('curso.user = :user', { user: user.id })
      .getOne();

    if (!videoFound) {
      throw new NotFoundException('Video does not exist');
    }
    await this._videoRepository.delete(videoFound);
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
