import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const PORT = process.env.PORT || 3001;
  await app.listen(PORT, () => {
    console.log(`server running at port:  http://localhost:${PORT}/`);
  });
}
bootstrap();