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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Estado = void 0;
const typeorm_1 = require("typeorm");
const municipio_entity_1 = require("./municipio.entity");
let Estado = class Estado {
    id;
    nombre;
    codigo_iso;
    municipios;
};
exports.Estado = Estado;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], Estado.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Estado.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Estado.prototype, "codigo_iso", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => municipio_entity_1.Municipio, (municipio) => municipio.estado),
    __metadata("design:type", Array)
], Estado.prototype, "municipios", void 0);
exports.Estado = Estado = __decorate([
    (0, typeorm_1.Entity)('estados')
], Estado);
//# sourceMappingURL=estado.entity.js.map