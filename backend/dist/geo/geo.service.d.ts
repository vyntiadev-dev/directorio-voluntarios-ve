import { Repository } from 'typeorm';
import { Estado } from './entities/estado.entity';
import { Municipio } from './entities/municipio.entity';
import { Parroquia } from './entities/parroquia.entity';
export declare class GeoService {
    private estadoRepository;
    private municipioRepository;
    private parroquiaRepository;
    constructor(estadoRepository: Repository<Estado>, municipioRepository: Repository<Municipio>, parroquiaRepository: Repository<Parroquia>);
    findAllEstados(): Promise<Estado[]>;
    findMunicipiosByEstado(estadoId: number): Promise<Municipio[]>;
    findParroquiasByMunicipio(municipioId: number): Promise<Parroquia[]>;
}
