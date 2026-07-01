import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilita validación global con los decoradores del DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,       // elimina campos que no están en el DTO
      forbidNonWhitelisted: true, // rechaza peticiones con campos extra
      transform: true,       // convierte tipos automáticamente (string → number)
    }),
  );

  // Habilita CORS para que el frontend pueda consumir la API
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 Servidor corriendo en http://localhost:3000`);
}
bootstrap();