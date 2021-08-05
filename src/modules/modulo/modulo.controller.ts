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
import { ModuloService } from './modulo.service';
import { Modulo } from './modulo.entity';
import { RoleType } from '../role/roletype.enum';
import { Roles } from '../role/decorators/role.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../role/guards/role.guard';
import { User } from '../user/user.entity';
import { GetUser } from '../auth/user.decorator';
import { createModuloDto } from './dto/create.dto';
@Controller('modulo')
export class ModuloController {
  constructor(private readonly _moduloService: ModuloService) {}
  @Roles(RoleType.ADMIN, RoleType.PROFESOR)
  @UseGuards(AuthGuard(), RoleGuard)
   @Get(':moduloid')
  getModulo(@Param('moduloid', ParseUUIDPipe) moduloid: string,  @GetUser() user: User): Promise<Modulo> {
    return this._moduloService.get(moduloid, user);
  }
  @Get()
  getAllModulo(): Promise<Modulo[]> {
    return this._moduloService.getAll();
  }
  @Roles(RoleType.ADMIN, RoleType.PROFESOR)
  @UseGuards(AuthGuard(), RoleGuard)
  @Get('/byidcurso/:idcurso')
  getAllModuloByIdCurso(
    @Param('idcurso', ParseUUIDPipe) idcurso: string,
    @GetUser() user: User,
  ): Promise<Modulo[]> {
    return this._moduloService.getAllByIdCurso(idcurso, user);
  }
  @Roles(RoleType.ADMIN, RoleType.PROFESOR)
  @UseGuards(AuthGuard(), RoleGuard)
  @Post()
  createModulo(@Body() modulo: createModuloDto, @GetUser() user: User): Promise<Modulo> {
    return this._moduloService.create(modulo, user);
  } 
  @Roles(RoleType.ADMIN, RoleType.PROFESOR)
  @UseGuards(AuthGuard(), RoleGuard)
  @Patch()
  updateModulo(   
    @Body() modulo: Modulo,
    @GetUser() user: User,
  ) {
    return this._moduloService.update(modulo, user);
  }
  @Roles(RoleType.ADMIN, RoleType.PROFESOR)
  @UseGuards(AuthGuard(), RoleGuard)
  @Delete(':moduloid')
  deleteModulo(
    @Param('moduloid', ParseUUIDPipe) moduloid: string,
    @GetUser() user: User,
  ) {
    return this._moduloService.delete(moduloid, user);
  }
}
