/*
https://docs.nestjs.com/controllers#controllers
*/
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
import { Roles } from '../role/decorators/role.decorator';
import { RoleType } from '../role/roletype.enum';
import { User } from '../user/user.entity';
import { GetUser } from '../auth/user.decorator';
import { RoleGuard } from '../role/guards/role.guard';
import { AuthGuard } from '@nestjs/passport';
import { ClasesFaltantes } from './clases-faltantes.entity';
import { ClasesFaltantesService } from './clases-faltantes.service';
import { Clase } from '../clase/clase.entity';
import { Actividad } from '../actividad/actividad.entity';
@Controller('clasesfaltantes')
export class ClasesFaltantesController {
  constructor(
    private readonly _clasesFaltantesService: ClasesFaltantesService,
  ) {}

  @Roles(RoleType.ADMIN, RoleType.PROFESOR, RoleType.DOCENTE)
  @UseGuards(AuthGuard(), RoleGuard)
  @Get(':idprogress')
  getAllByIdProgress(
    @Param('idprogress', ParseUUIDPipe) idprogress: string,
    @GetUser() user: User,
  ): Promise<ClasesFaltantes> {
    return this._clasesFaltantesService.getAllByIdProgress(idprogress, user);
  }
  @Roles(RoleType.ADMIN, RoleType.PROFESOR, RoleType.DOCENTE)
  @UseGuards(AuthGuard(), RoleGuard)
  @Post('getByidAndIdClass/:idFaltante')
  getClaseByIdFalAndIdClass(   
    @Body() clase: Clase,
    @Param('idFaltante', ParseUUIDPipe) idFaltante: string,
    @GetUser() user: User,
  ): Promise<ClasesFaltantes> {
    return this._clasesFaltantesService.ObtenerClaseByIdFalAndIdClass(
      idFaltante,
      clase.id,
      user,
    );
  }

  @Roles(RoleType.ADMIN, RoleType.PROFESOR, RoleType.DOCENTE)
  @UseGuards(AuthGuard(), RoleGuard)
  @Get('getAllActivitiesByIdClase/:idclase')
  getAllActivitiesByIdClase(
    @Param('idclase', ParseUUIDPipe) idclase: string,
    @GetUser() user: User,
  ): Promise<Actividad[]> {
    return this._clasesFaltantesService.getAllActivitiesByIdClase(idclase, user);
  }
}
