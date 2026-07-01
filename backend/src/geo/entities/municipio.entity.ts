import { Entity, PrimaryColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Estado } from './estado.entity';
import { Parroquia } from './parroquia.entity';

@Entity('municipios')
export class Municipio {
  @PrimaryColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  estado_id: number;

  @ManyToOne(() => Estado, (estado) => estado.municipios)
  @JoinColumn({ name: 'estado_id' })
  estado: Estado;

  @OneToMany(() => Parroquia, (parroquia) => parroquia.municipio)
  parroquias: Parroquia[];
}
