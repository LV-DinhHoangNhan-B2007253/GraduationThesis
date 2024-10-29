import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
// import { CategoryModule } from './category/category.module';
import { OrderModule } from './order/order.module';
import { ChatModule } from './chat/chat.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryModule } from './category/category.module';
import { MulterModule } from '@nestjs/platform-express';
import { ShopModule } from './shop/shop.module';
import { NotifycationModule } from './notifycation/notifycation.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    AuthModule,
    ProductModule,
    // CategoryModule,
    OrderModule,
    ChatModule,
    MongooseModule.forRoot(process.env.HOST_DB),
    CategoryModule,
    MulterModule.register({
      dest: './uploads',
    }),
    ShopModule,
    NotifycationModule,
    CommonModule,
  ],

  controllers: [],
  providers: [],
})
export class AppModule { }
