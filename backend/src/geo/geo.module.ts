import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeoService } from './geo.service';
import { GeoController } from './geo.controller';
import { Estado } from './entities/estado.entity';
import { Municipio } from './entities/municipio.entity';
import { Parroquia } from './entities/parroquia.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Estado, Municipio, Parroquia])],
  controllers: [GeoController],
  providers: [GeoService],
})
export class GeoModule {}