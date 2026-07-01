import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
  Optional,
} from '@nestjs/common';
import { VoluntariosService } from './voluntarios.service';
import { CrearVoluntarioDto } from './dto/crear-voluntario.dto';

@Controller('voluntarios')
export class VoluntariosController {
  constructor(private readonly voluntariosService: VoluntariosService) {}

  // POST /voluntarios
  // Registro público de un nuevo voluntario
  @Post()
  crear(@Body() dto: CrearVoluntarioDto) {
    return this.voluntariosService.crear(dto);
  }

  // GET /voluntarios?estado_id=4&especialidad_id=1
  // Directorio público con filtros opcionales
  @Get()
  buscar(
    @Query('estado_id') estado_id?: string,
    @Query('municipio_id') municipio_id?: string,
    @Query('parroquia_id') parroquia_id?: string,
    @Query('especialidad_id') especialidad_id?: string,
  ) {
    return this.voluntariosService.buscar({
      estado_id: estado_id ? parseInt(estado_id) : undefined,
      municipio_id: municipio_id ? parseInt(municipio_id) : undefined,
      parroquia_id: parroquia_id ? parseInt(parroquia_id) : undefined,
      especialidad_id: especialidad_id ? parseInt(especialidad_id) : undefined,
    });
  }

  // GET /voluntarios/:id
  // Ficha individual de un voluntario
  @Get(':id')
  buscarUno(@Param('id') id: string) {
    return this.voluntariosService.buscarUno(id);
  }
}