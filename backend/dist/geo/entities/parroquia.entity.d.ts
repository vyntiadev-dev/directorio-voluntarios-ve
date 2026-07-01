import { Municipio } from './municipio.entity';
export declare class Parroquia {
    id: number;
    nombre: string;
    municipio_id: number;
    municipio: Municipio;
}
