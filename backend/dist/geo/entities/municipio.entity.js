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
exports.Municipio = void 0;
const typeorm_1 = require("typeorm");
const estado_entity_1 = require("./estado.entity");
const parroquia_entity_1 = require("./parroquia.entity");
let Municipio = class Municipio {
    id;
    nombre;
    estado_id;
    estado;
    parroquias;
};
exports.Municipio = Municipio;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], Municipio.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Municipio.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Municipio.prototype, "estado_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => estado_entity_1.Estado, (estado) => estado.municipios),
    (0, typeorm_1.JoinColumn)({ name: 'estado_id' }),
    __metadata("design:type", estado_entity_1.Estado)
], Municipio.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => parroquia_entity_1.Parroquia, (parroquia) => parroquia.municipio),
    __metadata("design:type", Array)
], Municipio.prototype, "parroquias", void 0);
exports.Municipio = Municipio = __decorate([
    (0, typeorm_1.Entity)('municipios')
], Municipio);
//# sourceMappingURL=municipio.entity.js.map