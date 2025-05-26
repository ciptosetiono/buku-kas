import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
//import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

   // Enable validation for all incoming requests
  app.useGlobalPipes(new ValidationPipe());

  // Enable CORS jika perlu (misalnya jika frontend dan backend berbeda domain)
  app.enableCors({
    origin: process.env.FRONTEND_URL, // frontend URL(s) from .env as array
    credentials: true, // allow cookies
  });

  app.use(cookieParser());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
