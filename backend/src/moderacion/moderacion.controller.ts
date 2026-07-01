import { Controller, Get, Patch, Param, Query } from '@nestjs/common';
import { ModeracionService } from './moderacion.service';

@Controller('moderacion')
export class ModeracionController {
  constructor(private readonly moderacionService: ModeracionService) {}

  // GET /moderacion/voluntarios?estado=pendiente
  @Get('voluntarios')
  findAll(@Query('estado') estado?: string) {
    return this.moderacionService.findAll(estado);
  }

  // GET /moderacion/voluntarios/:id
  @Get('voluntarios/:id')
  findOne(@Param('id') id: string) {
    return this.moderacionService.findOne(id);
  }

  // PATCH /moderacion/voluntarios/:id/aprobar
  @Patch('voluntarios/:id/aprobar')
  aprobar(@Param('id') id: string) {
    return this.moderacionService.aprobar(id);
  }

  // PATCH /moderacion/voluntarios/:id/rechazar
  @Patch('voluntarios/:id/rechazar')
  rechazar(@Param('id') id: string) {
    return this.moderacionService.rechazar(id);
  }

  // PATCH /moderacion/voluntarios/:id/inactivar
  @Patch('voluntarios/:id/inactivar')
  inactivar(@Param('id') id: string) {
    return this.moderacionService.inactivar(id);
  }
}