import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Especialidad } from '../../especialidades/entities/especialidad.entity';
import { Parroquia } from '../../geo/entities/parroquia.entity';

export enum Disponibilidad {
  TIEMPO_COMPLETO = 'tiempo_completo',
  MEDIO_TIEMPO = 'medio_tiempo',
  FINES_DE_SEMANA = 'fines_de_semana',
  BAJO_DEMANDA = 'bajo_demanda',
}

export enum EstadoPerfil {
  PENDIENTE = 'pendiente',
  ACTIVO = 'activo',
  SUSPENDIDO = 'suspendido',
  INACTIVO = 'inactivo',
}

@Entity('voluntarios')
export class Voluntario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 120 })
  nombre_completo: string;

  @Column({ length: 15, unique: true, nullable: true })
  cedula: string;

  @Column({ length: 120, unique: true })
  email: string;

  @Column({ length: 20, nullable: true })
  telefono: string;

  @Column({ length: 20, nullable: true })
  whatsapp: string;

  @Column()
  especialidad_id: number;

  @ManyToOne(() => Especialidad)
  @JoinColumn({ name: 'especialidad_id' })
  especialidad: Especialidad;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ length: 40, nullable: true })
  numero_colegiatura: string;

  @Column()
  parroquia_id: number;

  @ManyToOne(() => Parroquia)
  @JoinColumn({ name: 'parroquia_id' })
  parroquia: Parroquia;

  @Column({
    type: 'enum',
    enum: Disponibilidad,
    default: Disponibilidad.BAJO_DEMANDA,
  })
  disponibilidad: Disponibilidad;

  @Column({ default: true })
  acepta_presencial: boolean;

  @Column({ default: true })
  acepta_remoto: boolean;

  @Column({
    type: 'enum',
    enum: EstadoPerfil,
    default: EstadoPerfil.PENDIENTE,
  })
  estado_perfil: EstadoPerfil;

  @CreateDateColumn()
  fecha_registro: Date;

  @UpdateDateColumn({ name: 'ultima_actualizacion' })
  ultima_actualizacion: Date;
}
