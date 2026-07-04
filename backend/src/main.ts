import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({ origin: '*' });

  const puerto = process.env.PORT || 3000;
  await app.listen(puerto, '0.0.0.0');
  console.log(`🚀 Servidor corriendo en puerto ${puerto}`);
}
bootstrap();