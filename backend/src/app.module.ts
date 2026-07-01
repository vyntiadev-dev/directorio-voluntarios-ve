import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeoModule } from './geo/geo.module';
import { VoluntariosModule } from './voluntarios/voluntarios.module';
import { EspecialidadesModule } from './especialidades/especialidades.module';

@Module({
  imports: [
    // 1. Carga las variables del archivo .env globalmente
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 2. Conecta a PostgreSQL usando esas variables
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false, // false porque ya tenemos el schema creado manualmente
      }),
      inject: [ConfigService],
    }),

    GeoModule,

    VoluntariosModule,

    EspecialidadesModule,
  ],
})
export class AppModule {}