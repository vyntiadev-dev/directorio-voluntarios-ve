import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { GeoService } from './geo.service';

@Controller('geo')
export class GeoController {
  constructor(private readonly geoService: GeoService) {}

  // GET /geo/estados
  @Get('estados')
  findAllEstados() {
    return this.geoService.findAllEstados();
  }

  // GET /geo/estados/4/municipios
  @Get('estados/:estadoId/municipios')
  findMunicipiosByEstado(@Param('estadoId', ParseIntPipe) estadoId: number) {
    return this.geoService.findMunicipiosByEstado(estadoId);
  }

  // GET /geo/municipios/404/parroquias
  @Get('municipios/:municipioId/parroquias')
  findParroquiasByMunicipio(@Param('municipioId', ParseIntPipe) municipioId: number) {
    return this.geoService.findParroquiasByMunicipio(municipioId);
  }
}