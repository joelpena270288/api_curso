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
import { RoleType } from '../role/roletype.enum';
import { Roles } from '../role/decorators/role.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../role/guards/role.guard';
import { User } from '../user/user.entity';
import { GetUser } from '../auth/user.decorator';
import { PreguntaMultiselectedService } from './pregunta-multiselected.service';
import { PreguntaMultiselected } from './pregunta-multiselected.entity';
import { createMultiDto } from './dto/create.dto';

@Controller('preguntamultiselected')
export class PreguntaMultiselectedController {
  constructor(
    private readonly _preguntaMultiselectedService: PreguntaMultiselectedService,
  ) {}

  @Roles(RoleType.ADMIN, RoleType.PROFESOR)
  @UseGuards(AuthGuard(), RoleGuard)
  @Post(':moduloid')
  create(@Body() preguntaChecked: createMultiDto,
  @Param('moduloid', ParseUUIDPipe) moduloid: string,
   @GetUser() user: User) {
    return this._preguntaMultiselectedService.create(moduloid, preguntaChecked, user);
  }
  @Roles(RoleType.ADMIN, RoleType.PROFESOR)
  @UseGuards(AuthGuard(), RoleGuard)
  @Get(':moduloid') 
  getAllByIdModulo(@Param('moduloid', ParseUUIDPipe) moduloid: string,
   @GetUser() user: User) {
    return this._preguntaMultiselectedService.getAllByIdModulo(moduloid, user);
  }

  
}
