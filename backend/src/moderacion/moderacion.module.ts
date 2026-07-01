import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModeracionService } from './moderacion.service';
import { ModeracionController } from './moderacion.controller';
import { Voluntario } from '../voluntarios/entities/voluntario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Voluntario])],
  controllers: [ModeracionController],
  providers: [ModeracionService],
})
export class ModeracionModule {}
