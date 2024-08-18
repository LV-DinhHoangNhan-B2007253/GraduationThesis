import { Injectable } from '@nestjs/common';
import { Order } from '../schema/Order.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class OrderService {
    @InjectModel(Order.name) private OrderModel: Model<Order>
}
