import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);



  // app.enableCors({
  //   origin: '*'
  // });
  app.enableCors({
    origin: 'http://localhost:3000', // Địa chỉ của client
    methods: 'GET,POST,PUT,DELETE,PATCH,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
  });
  app.use(json());
  app.use(urlencoded({ extended: true, }));
  const PORT = process.env.PORT || 3001;
  await app.listen(PORT, () => {
    console.log(`server running at port:  http://localhost:${PORT}/`);
  });
}
bootstrap();
