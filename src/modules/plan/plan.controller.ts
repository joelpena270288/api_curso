/*
https://docs.nestjs.com/controllers#controllers
*/

import { PlanService } from './plan.service';
import { Plan } from './plan.entity';
import { Roles } from '../role/decorators/role.decorator';
import { GetUser } from '../auth/user.decorator';
import { RoleGuard } from '../role/guards/role.guard';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../user/user.entity';
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

import { RoleType } from '../role/roletype.enum';
@Controller('plan')
export class PlanController {
  constructor(private readonly _planService: PlanService) {}
  
  @Get()
  getAllPlan(): Promise<Plan[]> {
    return this._planService.getAll();
  }
  @Roles(RoleType.ADMIN)
  @UseGuards(AuthGuard(), RoleGuard)
  @Post()
  createPlan(@Body() plan: Plan): Promise<Plan> {
    return this._planService.Create(plan);
  }
  @Roles(RoleType.ADMIN, RoleType.PROFESOR, RoleType.DOCENTE)
  @UseGuards(AuthGuard(), RoleGuard)
  @Get(':idplan')
  async addPlanUser(
    @Param('idplan', ParseUUIDPipe) idplan: string,
 
    @GetUser() user: User,
  ): Promise<boolean> {
    return this._planService.AddUserPlan(idplan, user.username);
  }
}
