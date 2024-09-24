import { forwardRef, Module } from '@nestjs/common';
import { OrderController } from './controller/order.controller';
import { OrderService } from './service/order.service';
import { Order, OrderSchema } from './schema/Order.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductService } from 'src/product/service/product.service';
import { ProductModule } from 'src/product/product.module';
import { AuthModule } from 'src/auth/auth.module';


@Module({
  controllers: [OrderController],
  providers: [OrderService,],
  imports: [MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]), forwardRef(() => ProductModule), forwardRef(() => AuthModule)]
})
export class OrderModule { }
