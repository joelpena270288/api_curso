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
import { ClasePasada } from './clases-pasadas.entity';
import { ClasePasadaService } from './clase-pasada.service';

@Controller('clasespasadas')
export class ClasePasadaController {
  constructor(private readonly _clasePasadaService: ClasePasadaService) {}
  @Roles(RoleType.ADMIN, RoleType.PROFESOR, RoleType.DOCENTE)
  @UseGuards(AuthGuard(), RoleGuard)
  @Get(':idprogress')
  getAllByIdProgress(
    @Param('idprogress', ParseUUIDPipe) idprogress: string,
    @GetUser() user: User,
  ): Promise<ClasePasada> {
    return this._clasePasadaService.getAllByIdProgress(idprogress, user);
  }
}
