import { Municipio } from './municipio.entity';
export declare class Estado {
    id: number;
    nombre: string;
    codigo_iso: string;
    municipios: Municipio[];
}
