import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/user.decorator';
import { Curso } from '../curso/curso.entity';
import { Roles } from '../role/decorators/role.decorator';
import { RoleGuard } from '../role/guards/role.guard';
import { RoleType } from '../role/roletype.enum';
import { User } from '../user/user.entity';
import { CursosProgreso } from './cursos-progreso.entity';
import { CursosProgresoService } from './cursos-progreso.service';


@Controller('cursosprogreso')
export class CursosProgresoController {
  constructor(private readonly _cursoProgresoService: CursosProgresoService) {}
  @Roles(RoleType.ADMIN, RoleType.PROFESOR, RoleType.DOCENTE)
  @UseGuards(AuthGuard(), RoleGuard)
  @Get('/all')
  getAllByUser(@GetUser() user: User): Promise<CursosProgreso[]> {
    return this._cursoProgresoService.getAllByUser(user);
  }
  @Roles(RoleType.ADMIN, RoleType.PROFESOR, RoleType.DOCENTE)
  @UseGuards(AuthGuard(), RoleGuard)
  @Post()
  createCursosProgreso(
    @Body() curso: Curso,
    @GetUser() user: User,
  ): Promise<CursosProgreso> {
    return this._cursoProgresoService.create(curso.id, user);
  }
  @Roles(RoleType.ADMIN, RoleType.PROFESOR, RoleType.DOCENTE)
  @UseGuards(AuthGuard(), RoleGuard)
  @Get(':idprogress')
  get(@Param('idprogress', ParseUUIDPipe) idprogress: string,@GetUser() user: User): Promise<CursosProgreso> {
    return this._cursoProgresoService.get(idprogress,user);
  }
}
