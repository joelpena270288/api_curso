import { PlanController } from './plan.controller';
import { PlanService } from './plan.service';
import { Module } from '@nestjs/common';
import { PlanRepository } from './plan.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';

import { RoleRepository } from '../role/role.repository';
import { UserRepository } from '../user/user.repository';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      PlanRepository,
      
      RoleRepository,
      UserRepository,
    ]),
    AuthModule,
  ],
  controllers: [PlanController],
  exports: [TypeOrmModule],
  providers: [PlanService],
})
export class PlanModule {}
