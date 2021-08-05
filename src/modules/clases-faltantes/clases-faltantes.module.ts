/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { ClasesFaltantesRepository } from './clases-faltantes.repository';
import {ClasesFaltantesController } from './clases-faltantes.controller';
import { ClasesFaltantesService } from './clases-faltantes.service';
@Module({
  imports: [TypeOrmModule.forFeature([ClasesFaltantesRepository]), AuthModule],
  exports: [TypeOrmModule],
  controllers: [ClasesFaltantesController],
  providers: [ClasesFaltantesService],
})
export class ClasesFaltantesModule {}
