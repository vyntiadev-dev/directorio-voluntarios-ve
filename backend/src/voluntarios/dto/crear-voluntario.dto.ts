import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsNumber,
  MaxLength,
  Matches,
} from 'class-validator';
import { Disponibilidad } from '../entities/voluntario.entity';

export class CrearVoluntarioDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre completo es obligatorio' })
  @MaxLength(120)
  nombre_completo: string;

  @IsOptional()
  @IsString()
  @Matches(/^[VEve]-?\d{6,8}$/, {
    message: 'La cédula debe tener formato V-12345678 o E-12345678',
  })
  cedula?: string;

  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  @IsNotEmpty({ message: 'El correo es obligatorio' })
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  telefono?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  whatsapp?: string;

  @IsNumber()
  @IsNotEmpty({ message: 'La especialidad es obligatoria' })
  especialidad_id: number;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  numero_colegiatura?: string;

  @IsNumber()
  @IsNotEmpty({ message: 'La parroquia es obligatoria' })
  parroquia_id: number;

  @IsEnum(Disponibilidad, { message: 'Disponibilidad no válida' })
  disponibilidad: Disponibilidad;

  @IsBoolean()
  acepta_presencial: boolean;

  @IsBoolean()
  acepta_remoto: boolean;
}
