import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VoluntariosService } from './voluntarios.service';
import { VoluntariosController } from './voluntarios.controller';
import { Voluntario } from './entities/voluntario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Voluntario])],
  controllers: [VoluntariosController],
  providers: [VoluntariosService],
})
export class VoluntariosModule {}