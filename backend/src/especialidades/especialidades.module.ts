import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Especialidad } from './entities/especialidad.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Especialidad])],
  exports: [TypeOrmModule],
})
export class EspecialidadesModule {}