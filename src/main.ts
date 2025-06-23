import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { OpenApiConfiguration } from './shared/infrastructure/documentation/openapi/configuration/OpenApiConfiguration';
import * as dotenv from 'dotenv';
import * as bodyParser from 'body-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  OpenApiConfiguration.setup(app);

  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  await app.listen(process.env.PORT || 3000);
}

// Manejo de errores al iniciar
bootstrap().catch((err) => {
  console.error('Error al iniciar la aplicación:', err);
});
