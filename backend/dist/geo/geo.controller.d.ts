import { GeoService } from './geo.service';
export declare class GeoController {
    private readonly geoService;
    constructor(geoService: GeoService);
    findAllEstados(): Promise<import("./entities/estado.entity").Estado[]>;
    findMunicipiosByEstado(estadoId: number): Promise<import("./entities/municipio.entity").Municipio[]>;
    findParroquiasByMunicipio(municipioId: number): Promise<import("./entities/parroquia.entity").Parroquia[]>;
}
