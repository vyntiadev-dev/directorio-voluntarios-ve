"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const estado_entity_1 = require("./entities/estado.entity");
const municipio_entity_1 = require("./entities/municipio.entity");
const parroquia_entity_1 = require("./entities/parroquia.entity");
let GeoService = class GeoService {
    estadoRepository;
    municipioRepository;
    parroquiaRepository;
    constructor(estadoRepository, municipioRepository, parroquiaRepository) {
        this.estadoRepository = estadoRepository;
        this.municipioRepository = municipioRepository;
        this.parroquiaRepository = parroquiaRepository;
    }
    findAllEstados() {
        return this.estadoRepository.find({
            order: { nombre: 'ASC' },
        });
    }
    findMunicipiosByEstado(estadoId) {
        return this.municipioRepository.find({
            where: { estado_id: estadoId },
            order: { nombre: 'ASC' },
        });
    }
    findParroquiasByMunicipio(municipioId) {
        return this.parroquiaRepository.find({
            where: { municipio_id: municipioId },
            order: { nombre: 'ASC' },
        });
    }
};
exports.GeoService = GeoService;
exports.GeoService = GeoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(estado_entity_1.Estado)),
    __param(1, (0, typeorm_1.InjectRepository)(municipio_entity_1.Municipio)),
    __param(2, (0, typeorm_1.InjectRepository)(parroquia_entity_1.Parroquia)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], GeoService);
//# sourceMappingURL=geo.service.js.map