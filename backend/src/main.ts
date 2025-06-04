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
    origin: ['http://localhost:3000', 'http://192.168.1.163:3000', process.env.FRONTEND_URL],
    credentials: true, // allow cookies
   // methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  app.use(cookieParser());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
