import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { VideoService } from './video.service';
import { Video } from './video.entity';
import { Roles } from '../role/decorators/role.decorator';
import { RoleType } from '../role/roletype.enum';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../role/guards/role.guard';
import { User } from '../user/user.entity';
import { GetUser } from '../auth/user.decorator';
import {createVideoDto} from './dto/create.dto';

@Controller('video')
export class VideoController {
  constructor(private readonly _videoService: VideoService) {} 
  @Roles(RoleType.ADMIN, RoleType.PROFESOR)
  @UseGuards(AuthGuard(), RoleGuard)
  @Post(':idactividad') 
  create(
    @Body() video: createVideoDto,
    @Param('idactividad', ParseUUIDPipe) idactividad: string,
    @GetUser() user: User,
  ): Promise<Video> {
    return this._videoService.create(video, user, idactividad);
  }
  @Get('/byidactividad/:idactividad')
  getAllVideoByIdActivity(
    @Param('idactividad', ParseUUIDPipe) idactividad: string,
  ): Promise<Video[]> {
    return this._videoService.getAllByIdClase(idactividad);
  }
  @Roles(RoleType.ADMIN, RoleType.PROFESOR)
  @UseGuards(AuthGuard(), RoleGuard)
  @Patch(':idvideo')
  updatecontenido(
    @Param('idvideo', ParseUUIDPipe) idvideo: string,
    @Body() video: Video,
    @GetUser() user: User,
  ) {
    return this._videoService.update(idvideo, video, user);
  }
  @Roles(RoleType.ADMIN, RoleType.PROFESOR)
  @UseGuards(AuthGuard(), RoleGuard)
  @Delete(':idvideo')
  deleteActividad(
    @Param('idvideo', ParseUUIDPipe) idvideo: string,
    @GetUser() user: User,
  ) {
    return this._videoService.delete(idvideo, user);
  }
}
