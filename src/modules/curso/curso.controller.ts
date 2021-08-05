import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CursoService } from './curso.service';
import { Curso } from './curso.entity';
import { ReadCursoDto } from './dto/read-curso.dto';
import { User } from '../user/user.entity';
import { GetUser } from '../auth/user.decorator';
import { RoleType } from '../role/roletype.enum';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../role/guards/role.guard';
import { Roles } from '../role/decorators/role.decorator';
@Controller('curso')
export class CursoController {
  constructor(private readonly _cursoService: CursoService) {}
  @Get()
  getAllCourses() {
    return this._cursoService.getAll();
  }
  @Roles(RoleType.ADMIN, RoleType.PROFESOR)
  @UseGuards(AuthGuard(), RoleGuard)
  @Post()
  createCurso(@Body() curso: Curso, @GetUser() user: User): Promise<Curso> {
    return this._cursoService.create(curso, user);
  }
  @Roles(RoleType.ADMIN, RoleType.PROFESOR)
  @UseGuards(AuthGuard(), RoleGuard)
  @Get('/byuser')
  getAllUser(@GetUser() user: User): Promise<Curso[]> {
    return this._cursoService.getAllByUser(user);
  }
  @Roles(RoleType.ADMIN, RoleType.PROFESOR)
  @UseGuards(AuthGuard(), RoleGuard)
  @Get(':idcurso')
  getCursoById(
    @Param('idcurso', ParseUUIDPipe) idcurso: string,
    @GetUser() user: User,
  ): Promise<Curso> {
    return this._cursoService.getById(idcurso, user);
  }

 
  @Get('detail/:idcurso')
  getDetail(
    @Param('idcurso', ParseUUIDPipe) idcurso: string,
    @GetUser() user: User,
  ): Promise<Curso> {
    return this._cursoService.getDetail(idcurso);
  }
  @Roles(RoleType.ADMIN, RoleType.PROFESOR)
  @UseGuards(AuthGuard(), RoleGuard)
  @Post('disponible/:idcurso')
  cambiarEstado(
    @Body() curso: Curso,
    @Param('idcurso', ParseUUIDPipe) idcurso: string, 
    @GetUser() user: User): Promise<Curso> {
    return this._cursoService.estado(idcurso, curso.disponible, user);
  }
}
