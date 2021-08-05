import { BadRequestException, Injectable } from '@nestjs/common';
import { PlanRepository } from './plan.repository';
import { Plan } from './plan.entity';
import { status } from '../../shared/entity-status.enum';
import { User } from '../user/user.entity';
import { UserRepository } from '../user/user.repository';

import { RoleRepository } from '../role/role.repository';
import { Role } from '../role/role.entity';
import { PlanType } from './plantype.enum';

@Injectable()
export class PlanService {
  constructor(
    private readonly _planRepository: PlanRepository,
    private readonly _roleRepository: RoleRepository,
    private readonly _userRepository: UserRepository,
  ) {}
  async getAll(): Promise<Plan[]> {
    return this._planRepository
      .createQueryBuilder('plan')
      .where('plan.status = :status', { status: status.ACTIVE })
      .andWhere('plan.nombre != :nombre', { nombre: PlanType.GENERAL })
      .getMany();
  }
  async Create(plan: Plan): Promise<Plan> {
    return this._planRepository.save(plan);
  }
  async AddUserPlan(idplan: string, user: string): Promise<boolean> {
    
    return true;
  }
}
