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
import { PreguntaHtmlService } from './pregunta-html.service';
import { PreguntaHtml } from './preguntahtml.entity';
import { createHtmltDto } from './dto/create.dto';
import { PreguntaEstundentReadHtmlDto } from './dto/pregunta-htm-estundentReadDto';

@Controller('pregunta-html')
export class PreguntaHtmlController {
  constructor(private readonly _preguntahtmlService: PreguntaHtmlService) {}
  @Roles(RoleType.ADMIN, RoleType.PROFESOR)
  @UseGuards(AuthGuard(), RoleGuard)
  @Post(':idactividad') 
  create(
    @Body() createHtmltDto: PreguntaHtml,
    @Param('idactividad', ParseUUIDPipe) idactividad: string,
    @GetUser() user: User,
  ): Promise<PreguntaHtml> {
    return this._preguntahtmlService.create(createHtmltDto, user, idactividad);
  }
  @Roles(RoleType.ADMIN, RoleType.PROFESOR)
  @UseGuards(AuthGuard(), RoleGuard)
  @Get('/byidactividad/:idactividad')
  getAllModuloByIdCurso(
    @Param('idactividad', ParseUUIDPipe) idactividad: string,
    @GetUser() user: User,
  ): Promise<PreguntaHtml[]> {
    return this._preguntahtmlService.getAllByIdClase(idactividad,user);
  }
  @Roles(RoleType.ADMIN, RoleType.PROFESOR)
  @UseGuards(AuthGuard(), RoleGuard)
  @Patch(':idpregunta')
  update(
    @Param('idpregunta', ParseUUIDPipe) idpregunta: string,
    @Body() pregunta: PreguntaHtml,
    @GetUser() user: User,
  ) {
    return this._preguntahtmlService.update(idpregunta, pregunta, user);
  }
  @Roles(RoleType.ADMIN, RoleType.PROFESOR)
  @UseGuards(AuthGuard(), RoleGuard)
  @Delete(':idpregunta')
  deleteActividad(
    @Param('idpregunta', ParseUUIDPipe) idpregunta: string,
    @GetUser() user: User,
  ) {
    return this._preguntahtmlService.delete(idpregunta, user);
  }

  @Roles(RoleType.ADMIN, RoleType.PROFESOR, RoleType.DOCENTE)
  @UseGuards(AuthGuard(), RoleGuard)
  @Get('/student/byidclase/:idclase')
  getAllByIdClaseStudent(
    @Param('idclase', ParseUUIDPipe) idclase: string,
    @GetUser() user: User,
  ): Promise<PreguntaEstundentReadHtmlDto[]> {
    return this._preguntahtmlService.getAllByIdClaseStudent(idclase,user);
  }
}
