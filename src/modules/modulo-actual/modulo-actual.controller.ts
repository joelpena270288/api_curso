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
  import { AuthGuard } from '@nestjs/passport';
  import { GetUser } from '../auth/user.decorator';
  import { ModuloActual } from './modulo-actual.entity';
  import { Roles } from '../role/decorators/role.decorator';
import { RoleGuard } from '../role/guards/role.guard';
import { RoleType } from '../role/roletype.enum';
import { User } from '../user/user.entity';
  import {ModuloActualService} from './modulo-actual.service';
@Controller("modulo-actual")
export class ModuloActualController { 
    constructor(private readonly _moduloServiceActual: ModuloActualService) {}

    @Roles(RoleType.ADMIN, RoleType.PROFESOR)
    @UseGuards(AuthGuard(), RoleGuard)
    @Get("/byIdCursoProgreso/:idprogress")
    createCurso( @Param('idprogress', ParseUUIDPipe) idprogress: string, @GetUser() user: User): Promise<ModuloActual> {
      return this._moduloServiceActual.getByIdProgress(idprogress, user);
    }
}
