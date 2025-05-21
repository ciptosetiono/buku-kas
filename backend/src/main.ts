import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
//import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

   // Enable validation for all incoming requests
  app.useGlobalPipes(new ValidationPipe());

  // Enable CORS jika perlu (misalnya jika frontend dan backend berbeda domain)
  app.enableCors({
    origin: 'http://localhost:3000', // frontend URL
    credentials: true, // allow cookies
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
