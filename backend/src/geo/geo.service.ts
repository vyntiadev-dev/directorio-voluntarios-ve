import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estado } from './entities/estado.entity';
import { Municipio } from './entities/municipio.entity';
import { Parroquia } from './entities/parroquia.entity';

@Injectable()
export class GeoService {
  constructor(
    @InjectRepository(Estado)
    private estadoRepository: Repository<Estado>,

    @InjectRepository(Municipio)
    private municipioRepository: Repository<Municipio>,

    @InjectRepository(Parroquia)
    private parroquiaRepository: Repository<Parroquia>,
  ) {}

  // Devuelve todos los estados ordenados alfabéticamente
  findAllEstados() {
    return this.estadoRepository.find({
      order: { nombre: 'ASC' },
    });
  }

  // Devuelve los municipios de un estado específico
  findMunicipiosByEstado(estadoId: number) {
    return this.municipioRepository.find({
      where: { estado_id: estadoId },
      order: { nombre: 'ASC' },
    });
  }

  // Devuelve las parroquias de un municipio específico
  findParroquiasByMunicipio(municipioId: number) {
    return this.parroquiaRepository.find({
      where: { municipio_id: municipioId },
      order: { nombre: 'ASC' },
    });
  }
}