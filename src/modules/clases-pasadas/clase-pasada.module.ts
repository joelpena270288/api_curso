import { Module } from '@nestjs/common';
import { ClasePasadaController } from './clase-pasada.controller';
import { ClasePasadaService } from './clase-pasada.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClasePasadaRepository } from './clase-pasada.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([ClasePasadaRepository]), AuthModule],
  exports: [TypeOrmModule],
  controllers: [ClasePasadaController],
  providers: [ClasePasadaService],
})
export class ClasePasadaModule {}
