import { ModuloActualService } from './modulo-actual.service';
import { ModuloActualController } from './modulo-actual.controller';
import {ModuloActualRepository} from './modulo-actual.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ModuloActualRepository,
    ]),
    AuthModule,
  ],
  controllers: [ModuloActualController, ModuloActualController],
  providers: [ModuloActualService],
})
export class ModuloActualModule {}
