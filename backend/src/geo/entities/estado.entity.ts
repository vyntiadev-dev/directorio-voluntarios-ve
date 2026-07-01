import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { Municipio } from './municipio.entity';

@Entity('estados')
export class Estado {
  @PrimaryColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  codigo_iso: string;

  @OneToMany(() => Municipio, (municipio) => municipio.estado)
  municipios: Municipio[];
}
