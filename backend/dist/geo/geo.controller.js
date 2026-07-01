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
exports.GeoController = void 0;
const common_1 = require("@nestjs/common");
const geo_service_1 = require("./geo.service");
let GeoController = class GeoController {
    geoService;
    constructor(geoService) {
        this.geoService = geoService;
    }
    findAllEstados() {
        return this.geoService.findAllEstados();
    }
    findMunicipiosByEstado(estadoId) {
        return this.geoService.findMunicipiosByEstado(estadoId);
    }
    findParroquiasByMunicipio(municipioId) {
        return this.geoService.findParroquiasByMunicipio(municipioId);
    }
};
exports.GeoController = GeoController;
__decorate([
    (0, common_1.Get)('estados'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GeoController.prototype, "findAllEstados", null);
__decorate([
    (0, common_1.Get)('estados/:estadoId/municipios'),
    __param(0, (0, common_1.Param)('estadoId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], GeoController.prototype, "findMunicipiosByEstado", null);
__decorate([
    (0, common_1.Get)('municipios/:municipioId/parroquias'),
    __param(0, (0, common_1.Param)('municipioId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], GeoController.prototype, "findParroquiasByMunicipio", null);
exports.GeoController = GeoController = __decorate([
    (0, common_1.Controller)('geo'),
    __metadata("design:paramtypes", [geo_service_1.GeoService])
], GeoController);
//# sourceMappingURL=geo.controller.js.map