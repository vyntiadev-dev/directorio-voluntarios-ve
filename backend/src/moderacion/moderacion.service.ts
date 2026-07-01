import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Voluntario, EstadoPerfil } from '../voluntarios/entities/voluntario.entity';

@Injectable()
export class ModeracionService {
  constructor(
    @InjectRepository(Voluntario)
    private voluntarioRepository: Repository<Voluntario>,
  ) {}

  // GET /moderacion/voluntarios?estado=pendiente
  findAll(estado?: string) {
    return this.voluntarioRepository.find({
      where: {
        estado_perfil: (estado as EstadoPerfil) ?? EstadoPerfil.PENDIENTE,
      },
      relations: { especialidad: true, parroquia: true },
      order: { fecha_registro: 'ASC' },
    });
  }

  // GET /moderacion/voluntarios/:id
  async findOne(id: string) {
    const voluntario = await this.voluntarioRepository.findOne({
      where: { id },
      relations: { especialidad: true, parroquia: true },
    });

    if (!voluntario) {
      throw new NotFoundException('Voluntario no encontrado');
    }

    return voluntario;
  }

  // PATCH /moderacion/voluntarios/:id/aprobar
  async aprobar(id: string) {
    const voluntario = await this.findOne(id);
    voluntario.estado_perfil = EstadoPerfil.ACTIVO;
    await this.voluntarioRepository.save(voluntario);
    return { mensaje: `Voluntario ${voluntario.nombre_completo} aprobado correctamente` };
  }

  // PATCH /moderacion/voluntarios/:id/rechazar
  async rechazar(id: string) {
    const voluntario = await this.findOne(id);
    voluntario.estado_perfil = EstadoPerfil.SUSPENDIDO;
    await this.voluntarioRepository.save(voluntario);
    return { mensaje: `Voluntario ${voluntario.nombre_completo} rechazado` };
  }

  // PATCH /moderacion/voluntarios/:id/inactivar
  async inactivar(id: string) {
    const voluntario = await this.findOne(id);
    voluntario.estado_perfil = EstadoPerfil.INACTIVO;
    await this.voluntarioRepository.save(voluntario);
    return { mensaje: `Voluntario ${voluntario.nombre_completo} marcado como inactivo` };
  }
}