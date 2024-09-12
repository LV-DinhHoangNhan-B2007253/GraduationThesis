import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'body-parser';
import * as express from 'express';
import { join } from 'path';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);



  // app.enableCors({
  //   origin: '*'
  // });
  app.enableCors({
    origin: '*', // Địa chỉ của client
    methods: 'GET,POST,PUT,DELETE,PATCH,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
  });
  app.use(json());
  app.use(urlencoded({ extended: true, }));
  // Định cấu hình để phục vụ các tệp tĩnh từ thư mục uploads
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
  const PORT = process.env.PORT || 3001;
  await app.listen(PORT, () => {
    console.log(`server running at port:  http://localhost:${PORT}/`);
  });
}
bootstrap();
