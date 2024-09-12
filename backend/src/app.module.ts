import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { OrderModule } from './order/order.module';
import { ChatModule } from './chat/chat.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryItemModule } from './category-item/category-item.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    AuthModule,
    ProductModule,
    CategoryModule,
    OrderModule,
    ChatModule,
    MongooseModule.forRoot(process.env.HOST_DB),
    CategoryItemModule,
    MulterModule.register({
      dest: './uploads',
    }),
  ],

  controllers: [],
  providers: [],
})
export class AppModule { }
