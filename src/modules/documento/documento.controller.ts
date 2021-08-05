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
import { DocumentoService } from './documento.service';
import { Documento } from './documento.entity';
import { RoleType } from '../role/roletype.enum';
import { Roles } from '../role/decorators/role.decorator';
import { RoleGuard } from '../role/guards/role.guard';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/user.decorator';
import { User } from '../user/user.entity';
import { createDocumentDto } from './dto/create.dto';
@Controller('documento')
export class DocumentoController {
    constructor(private readonly _documentoService: DocumentoService) {}
    @Roles(RoleType.ADMIN, RoleType.PROFESOR)
    @UseGuards(AuthGuard(), RoleGuard)
    @Post(':idactividad') 
    create(
      @Body() documento: createDocumentDto,
      @Param('idactividad', ParseUUIDPipe) idactividad: string,
      @GetUser() user: User,
    ): Promise<Documento> {
      return this._documentoService.create(documento, user, idactividad);
    }
    @Get('/byidactividad/:idactividad')
  getAllModuloByIdCurso(
    @Param('idactividad', ParseUUIDPipe) idactividad: string,
  ): Promise<Documento[]> {
    return this._documentoService.getAllByIdClase(idactividad);
  }
  @Roles(RoleType.ADMIN, RoleType.PROFESOR)
  @UseGuards(AuthGuard(), RoleGuard)
  @Patch(':iddocumento')
  updatecontenido(
    @Param('iddocumento', ParseUUIDPipe) iddocumento: string,
    @Body() documento: Documento,
    @GetUser() user: User,
  ) {
    return this._documentoService.update(iddocumento, documento, user);
  }
  @Roles(RoleType.ADMIN, RoleType.PROFESOR)
  @UseGuards(AuthGuard(), RoleGuard)
  @Delete(':iddocumento')
  deleteActividad(
    @Param('iddocumento', ParseUUIDPipe) iddocumento: string,
    @GetUser() user: User,
  ) {
    return this._documentoService.delete(iddocumento, user);
  }
}
