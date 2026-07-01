import { Estado } from './estado.entity';
import { Parroquia } from './parroquia.entity';
export declare class Municipio {
    id: number;
    nombre: string;
    estado_id: number;
    estado: Estado;
    parroquias: Parroquia[];
}
