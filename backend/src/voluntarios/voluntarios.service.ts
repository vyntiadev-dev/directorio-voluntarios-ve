import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Voluntario } from './entities/voluntario.entity';
import { CrearVoluntarioDto } from './dto/crear-voluntario.dto';

@Injectable()
export class VoluntariosService {
  constructor(
    @InjectRepository(Voluntario)
    private voluntarioRepository: Repository<Voluntario>,
  ) {}

  // POST /voluntarios — Registro público
  async crear(dto: CrearVoluntarioDto): Promise<Voluntario> {
    // Verificar si el email ya existe
    const emailExiste = await this.voluntarioRepository.findOne({
      where: { email: dto.email },
    });
    if (emailExiste) {
      throw new ConflictException('Ya existe un voluntario registrado con ese correo');
    }

    // Verificar si la cédula ya existe (si fue enviada)
    if (dto.cedula) {
      const cedulaExiste = await this.voluntarioRepository.findOne({
        where: { cedula: dto.cedula },
      });
      if (cedulaExiste) {
        throw new ConflictException('Ya existe un voluntario registrado con esa cédula');
      }
    }

    const voluntario = this.voluntarioRepository.create(dto);
    return this.voluntarioRepository.save(voluntario);
  }

  // GET /voluntarios — Directorio público con filtros
  async buscar(filtros: {
    estado_id?: number;
    municipio_id?: number;
    parroquia_id?: number;
    especialidad_id?: number;
  }): Promise<Voluntario[]> {
    const query = this.voluntarioRepository
      .createQueryBuilder('v')
      .innerJoinAndSelect('v.especialidad', 'especialidad')
      .innerJoinAndSelect('v.parroquia', 'parroquia')
      .innerJoin('parroquia.municipio', 'municipio')
      .addSelect(['municipio.id', 'municipio.nombre'])
      .innerJoin('municipio.estado', 'estado')
      .addSelect(['estado.id', 'estado.nombre'])
      .where('v.estado_perfil = :estado', { estado: 'activo' });

    if (filtros.especialidad_id) {
      query.andWhere('v.especialidad_id = :especialidad_id', {
        especialidad_id: filtros.especialidad_id,
      });
    }

    if (filtros.parroquia_id) {
      query.andWhere('v.parroquia_id = :parroquia_id', {
        parroquia_id: filtros.parroquia_id,
      });
    } else if (filtros.municipio_id) {
      query.andWhere('municipio.id = :municipio_id', {
        municipio_id: filtros.municipio_id,
      });
    } else if (filtros.estado_id) {
      query.andWhere('estado.id = :estado_id', {
        estado_id: filtros.estado_id,
      });
    }

    return query.orderBy('v.fecha_registro', 'DESC').getMany();
  }

  // GET /voluntarios/:id — Ficha individual
  async buscarUno(id: string): Promise<Voluntario> {
    const voluntario = await this.voluntarioRepository.findOne({
      where: { id, estado_perfil: 'activo' as any },
      relations: { especialidad: true, parroquia: true },
    });

    if (!voluntario) {
      throw new NotFoundException('Voluntario no encontrado');
    }

    return voluntario;
  }
}