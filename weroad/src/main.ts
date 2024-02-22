import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configDotenv } from 'dotenv';
import { AsyncLocalStorage } from 'async_hooks';

configDotenv();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const asyncLocalStorage = new AsyncLocalStorage();
  app.use((req, res, next) => {
    asyncLocalStorage.run(new Map(), () => {
      next();
    });
  });
  await app.listen(process.env.PORT);
}
bootstrap();
