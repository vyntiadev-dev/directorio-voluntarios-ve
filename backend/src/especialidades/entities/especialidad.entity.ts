import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('especialidades')
export class Especialidad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 80, unique: true })
  nombre: string;

  @Column({ length: 10, nullable: true })
  icono: string;
}
