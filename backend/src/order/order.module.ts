import { Module } from '@nestjs/common';
import { OrderController } from './controller/controller.controller';
import { OrderService } from './service/service.service';
import { Order, OrderSchema } from './schema/Order.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  imports: [MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }])]
})
export class OrderModule { }
