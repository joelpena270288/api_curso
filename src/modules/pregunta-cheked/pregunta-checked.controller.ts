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
import { PreguntaCheckedService } from './pregunta-checked.service';
import {createCheckedDto } from './dto/create.dto';
import { PreguntaChecked } from './pregunta-checked.entity';
@Controller('preguntachecked')
export class PreguntaCheckedController {
  constructor(
    private readonly _preguntaCheckedService: PreguntaCheckedService,
  ) {}
 
  @Roles(RoleType.ADMIN, RoleType.PROFESOR)
  @UseGuards(AuthGuard(), RoleGuard)
  @Post(':moduloid')
  create(@Body() preguntaChecked: createCheckedDto,
  @Param('moduloid', ParseUUIDPipe) moduloid: string,
   @GetUser() user: User) {
    return this._preguntaCheckedService.create(moduloid, preguntaChecked, user);
  }
  @Roles(RoleType.ADMIN, RoleType.PROFESOR)
  @UseGuards(AuthGuard(), RoleGuard)
  @Get(':moduloid') 
  getAllByIdModulo(@Param('moduloid', ParseUUIDPipe) moduloid: string,
   @GetUser() user: User) {
    return this._preguntaCheckedService.getAllByIdModulo(moduloid, user);
  }

}
