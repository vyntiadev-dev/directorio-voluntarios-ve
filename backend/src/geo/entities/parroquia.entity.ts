import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Municipio } from './municipio.entity';

@Entity('parroquias')
export class Parroquia {
  @PrimaryColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  municipio_id: number;

  @ManyToOne(() => Municipio, (municipio) => municipio.parroquias)
  @JoinColumn({ name: 'municipio_id' })
  municipio: Municipio;
}
