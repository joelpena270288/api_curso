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
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/user.decorator';
import { Roles } from '../role/decorators/role.decorator';
import { RoleGuard } from '../role/guards/role.guard';
import { RoleType } from '../role/roletype.enum';
import { User } from '../user/user.entity';
import { ActividadExtraclaseService } from './actividad-extraclase.service';
import { ActividadesExtraclase } from './actividadextraclase.entity';
import {createActividadExtraclasetDto } from './dto/create.dto';

@Controller('actividad-extraclase')
export class ActividadExtraclaseController {
  constructor(
    private readonly _actvidadextraclaseService: ActividadExtraclaseService,
  ) {}
  @Roles(RoleType.ADMIN, RoleType.PROFESOR)
  @UseGuards(AuthGuard(), RoleGuard)
  @Post(':idactividad') 
  create(
    @Body() extraclase: createActividadExtraclasetDto,
    @Param('idactividad', ParseUUIDPipe) idactividad: string,
    @GetUser() user: User,
  ): Promise<ActividadesExtraclase> {
    return this._actvidadextraclaseService.create(extraclase, user, idactividad);
  }
  @Roles(RoleType.ADMIN, RoleType.PROFESOR)
  @UseGuards(AuthGuard(), RoleGuard)
  @Get('/byidactividad/:idactividad')
  getAllModuloByIdCurso(
    @Param('idactividad', ParseUUIDPipe) idactividad: string,
    @GetUser() user: User,
  ): Promise<ActividadesExtraclase[]> {
    return this._actvidadextraclaseService.getAllByIdClase(idactividad, user);
  }
  @Roles(RoleType.ADMIN, RoleType.PROFESOR)
  @UseGuards(AuthGuard(), RoleGuard)
  @Patch(':idactividad')
  updateHomework(
    @Param('idactividad', ParseUUIDPipe) idactividad: string,
    @Body() actividadextra: ActividadesExtraclase,
    @GetUser() user: User,
  ) {
    return this._actvidadextraclaseService.update(
      idactividad,
      actividadextra,
      user,
    );
  }
  @Roles(RoleType.ADMIN, RoleType.PROFESOR)
  @UseGuards(AuthGuard(), RoleGuard)
  @Delete(':idactividad')
  deleteActividad(
    @Param('idactividad', ParseUUIDPipe) idactividad: string,
    @GetUser() user: User,
  ) {
    return this._actvidadextraclaseService.delete(idactividad, user);
  }

  
}
