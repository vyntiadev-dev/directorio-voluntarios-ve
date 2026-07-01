import { Controller, Get } from '@nestjs/common';
import { EspecialidadesService } from './especialidades.service';

@Controller('especialidades')
export class EspecialidadesController {
  constructor(private readonly especialidadesService: EspecialidadesService) {}

  // GET /especialidades
  @Get()
  findAll() {
    return this.especialidadesService.findAll();
  }
}