import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Especialidad } from './entities/especialidad.entity';

@Injectable()
export class EspecialidadesService {
  constructor(
    @InjectRepository(Especialidad)
    private especialidadRepository: Repository<Especialidad>,
  ) {}

  findAll() {
    return this.especialidadRepository.find({
      order: { nombre: 'ASC' },
    });
  }
}